import { getAbsoluteFileURL } from '@zptxdev/zptx-lib';
import type {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ClientOptions,
    CommandInteraction,
    ModalSubmitInteraction,
} from 'discord.js';
import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { has, set } from 'lodash-es';
import { createInterface } from 'readline/promises';

export enum ExpectedConfigItemTypes {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
}

type ExpectedConfigItem = {
    path: string;
    type: ExpectedConfigItemTypes;
    label: string;
    description: string;
};

type EventHandler = (...args: unknown[]) => Promise<void>;

type AcceptedInteraction =
    | CommandInteraction
    | ButtonInteraction
    | AnySelectMenuInteraction
    | ModalSubmitInteraction;

export class ZPTXClient extends Client {
    protected config: Record<string, unknown>;
    protected expectedConfig: ExpectedConfigItem[];
    protected hookHandlers = {
        commands: new Collection<
            string,
            (interaction: CommandInteraction) => Promise<void>
        >(),
        buttons: new Collection<
            string,
            (interaction: ButtonInteraction) => Promise<void>
        >(),
        selectMenus: new Collection<
            string,
            (interaction: AnySelectMenuInteraction) => Promise<void>
        >(),
        modals: new Collection<
            string,
            (interaction: ModalSubmitInteraction) => Promise<void>
        >(),
        events: new Collection<string, EventHandler[]>(),
    };

    constructor(
        options: ClientOptions,
        config: Record<string, unknown>,
        expectedConfig: ExpectedConfigItem[],
    ) {
        super(options);
        this.config = config;
        this.expectedConfig = expectedConfig;
    }

    /**
     * Check if the config has all the required values
     * @param expectedConfig - The expected config items to check for
     * @returns - Whether the config is valid or not
     */
    private validateConfig(): boolean {
        return !this.expectedConfig.some(
            (config): boolean => !has(this.config, config.path),
        );
    }

    /**
     * Setup the config if it is missing any values
     * @param expectedConfig - The expected config items to check for
     * @returns - The updated config object
     */
    async setupConfig(): Promise<Record<string, unknown>> {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        if (this.validateConfig()) {
            return this.config;
        }
        const missingConfig = this.expectedConfig.filter(
            (config): boolean => !has(this.config, config.path),
        );
        for await (const config of missingConfig) {
            const answer = await rl.question(
                `${config.label} - ${
                    config.description
                }\nEnter a value of type ${config.type}${
                    config.type === 'boolean' ? ' (true/false)' : ''
                }: `,
            );
            switch (config.type) {
                case 'number':
                    this.config = set(
                        this.config,
                        config.path,
                        isNaN(Number(answer)) ? 0 : Number(answer),
                    );
                    break;
                case 'boolean':
                    this.config = set(
                        this.config,
                        config.path,
                        answer.toLowerCase() === 'true',
                    );
                    break;
                default:
                    this.config = set(this.config, config.path, answer);
                    break;
            }
        }
        rl.close();
        return this.config;
    }

    /**
     * Initialize the client, sets up the event handlers
     * @param baseURL - The base URL (usually import.meta.url) of the main file
     */
    async initialize(baseURL: string): Promise<void> {
        const modules = readdirSync(getAbsoluteFileURL(baseURL, ['modules']));
        for await (const module of modules) {
            const hooks = readdirSync(
                getAbsoluteFileURL(baseURL, ['modules', module]),
            ).filter((hook): boolean =>
                [
                    'Buttons',
                    'Commands',
                    'Modals',
                    'SelectMenus',
                    'Events',
                ].includes(hook),
            );
            for await (const hook of hooks) {
                const handlers = readdirSync(
                    getAbsoluteFileURL(baseURL, ['modules', module, hook]),
                ).filter(
                    (handler): boolean =>
                        handler.endsWith('.ts') || handler.endsWith('.js'),
                );
                for await (const handler of handlers) {
                    const { default: handlerData } = await import(
                        getAbsoluteFileURL(baseURL, [
                            'modules',
                            module,
                            hook,
                            handler,
                        ]).toString()
                    );
                    const camelHook = (hook.charAt(0).toLowerCase() +
                        hook.slice(1)) as keyof typeof this.hookHandlers;
                    const pureHandler = handler.slice(0, -3);
                    if (camelHook === 'events') {
                        let eventHandlers: EventHandler[] = [];
                        if (this.hookHandlers[camelHook].has(pureHandler)) {
                            eventHandlers =
                                this.hookHandlers[camelHook].get(pureHandler);
                        }
                        eventHandlers.push(handlerData.execute);
                        this.hookHandlers[camelHook].set(
                            pureHandler,
                            eventHandlers,
                        );
                        continue;
                    }
                    this.hookHandlers[camelHook].set(
                        pureHandler,
                        handlerData.execute,
                    );
                }
            }
        }
        const hookInteractionHandler = async (
            interaction: AcceptedInteraction,
        ): Promise<void> => {
            let execute: (
                interaction: AcceptedInteraction,
            ) => Promise<void> | undefined;
            if (interaction.isCommand()) {
                execute = this.hookHandlers.commands.get(
                    interaction.commandName,
                );
            }
            if (interaction.isButton()) {
                execute = this.hookHandlers.buttons.get(
                    interaction.customId.split(':')[0],
                );
            }
            if (interaction.isAnySelectMenu()) {
                execute = this.hookHandlers.selectMenus.get(
                    interaction.customId.split(':')[0],
                );
            }
            if (interaction.isModalSubmit()) {
                execute = this.hookHandlers.modals.get(
                    interaction.customId.split(':')[0],
                );
            }
            if (execute) {
                await execute(interaction as AcceptedInteraction);
            }
        };
        if (this.hookHandlers.events.has('interactionCreate')) {
            this.hookHandlers.events
                .get('interactionCreate')
                .push(hookInteractionHandler);
        } else {
            this.hookHandlers.events.set('interactionCreate', [
                hookInteractionHandler,
            ]);
        }
        this.hookHandlers.events.forEach((eventHandler, key): void => {
            this.addListener(key, async (...args): Promise<void> => {
                for await (const handler of eventHandler) {
                    await handler(...args);
                }
            });
        });
    }
}
