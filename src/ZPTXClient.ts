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
import terminalKitPackage from 'terminal-kit';
import type { Logger } from 'winston';
import type { Config } from './Config.js';
import { logger } from './Logger.js';
const { terminal } = terminalKitPackage;

terminal.on('key', (name: string): void => {
    if (name === 'CTRL_C') {
        process.exit();
    }
});

/**
 * The event handler function
 */
type EventHandler = (...args: unknown[]) => Promise<void>;

/**
 * The accepted interaction types
 */
type AcceptedInteraction =
    | CommandInteraction
    | ButtonInteraction
    | AnySelectMenuInteraction
    | ModalSubmitInteraction;

export class ZPTXClient extends Client {
    config: Config;
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
    private verbose = process.argv
        .slice(2)
        .map((argv): string => argv.toLowerCase())
        .includes('--verbose');
    private logger: {
        error: (message: string) => Logger;
        warn: (message: string) => Logger;
        info: (message: string) => Logger;
        verbose: (message: string) => Logger;
    };

    /**
     * Creates an instance of ZPTXClient.
     * @example
     * const client = new ZPTXClient({
     *     {
     *         intents: [
     *             GatewayIntentBits.Guilds,
     *         ],
     *     },
     *     new Config([
     *         new StringConfigItem(
     *             'token',
     *             'Token',
     *             'The bot token',
     *             { required: true },
     *         ),
     *     ]),
     * });
     * // To pass existing config before setting up, use:
     * client.config.parseJSON(config.JSON());
     * @param options - discord.js ClientOptions
     * @param config - Config instance
     */
    constructor(options: ClientOptions, config: Config) {
        super(options);
        this.config = config;
        const label = 'Skeleton';
        this.logger = {
            error: (message): Logger => logger.error({ message, label }),
            warn: (message): Logger => logger.warn({ message, label }),
            info: (message): Logger => logger.info({ message, label }),
            verbose: (message): Logger =>
                this.verbose ? logger.verbose({ message, label }) : logger,
        };
    }

    /**
     * Initialize the client, sets up the event handlers
     * @example
     * await client.initialize(import.meta.url);
     * client.login(client.config.get('token'));
     * @param baseURL - The base URL (usually import.meta.url) of the main/index file
     */
    async initialize(baseURL: string): Promise<void> {
        this.logger.info('Initializing client');
        const modules = readdirSync(getAbsoluteFileURL(baseURL, ['modules']));
        this.logger.verbose('Loading modules');
        for await (const module of modules) {
            this.logger.verbose(
                `Loading module ${module} (${modules.indexOf(module) + 1} of ${
                    modules.length
                })`,
            );
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
                this.logger.verbose(
                    `Loading hook ${hook} (${hooks.indexOf(hook) + 1} of ${
                        hooks.length
                    })`,
                );
                const handlers = readdirSync(
                    getAbsoluteFileURL(baseURL, ['modules', module, hook]),
                ).filter(
                    (handler): boolean =>
                        handler.endsWith('.ts') || handler.endsWith('.js'),
                );
                for await (const handler of handlers) {
                    this.logger.verbose(
                        `Loading handler ${handler} (${
                            handlers.indexOf(handler) + 1
                        } of ${handlers.length})`,
                    );
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
                    this.logger.verbose(`Loaded handler ${handler}`);
                }
                this.logger.verbose(`Loaded hook ${hook}`);
            }
            this.logger.verbose(`Loaded module ${module}`);
        }
        this.logger.verbose('Loaded modules');
        // define our hook interaction handler (which is an event handler itself)
        this.logger.verbose('Setting up hook interaction handler');
        const hookInteractionHandler = async (
            interaction: AcceptedInteraction,
        ): Promise<void> => {
            let execute: (
                interaction: AcceptedInteraction,
            ) => Promise<void> | undefined;
            const source = `from UID ${interaction.user.id}${
                interaction.inGuild() ? ` in GID ${interaction.guildId}` : ''
            }`;
            let details = '';
            if (interaction.isCommand()) {
                details = `command /${interaction.commandName}${
                    interaction.options.data.length > 0
                        ? ` ${interaction.options.data
                              .map(
                                  (option): string =>
                                      `${option.name}:${option.value}`,
                              )
                              .join(' ')}`
                        : ''
                }`;
            } else {
                details = `${interaction.constructor.name} ${interaction.customId}`;
            }
            this.logger.info(`Processing ${details} ${source}`);
            if (interaction.isCommand()) {
                execute = this.hookHandlers.commands.get(
                    interaction.commandName,
                );
                this.logger.verbose(
                    `Matched command handler /${interaction.commandName}`,
                );
            }
            if (interaction.isButton()) {
                execute = this.hookHandlers.buttons.get(
                    interaction.customId.split(':')[0],
                );
                this.logger.verbose(
                    `Matched button interaction handler ${
                        interaction.customId.split(':')[0]
                    }`,
                );
            }
            if (interaction.isAnySelectMenu()) {
                execute = this.hookHandlers.selectMenus.get(
                    interaction.customId.split(':')[0],
                );
                this.logger.verbose(
                    `Matched select menu interaction handler ${
                        interaction.customId.split(':')[0]
                    }`,
                );
            }
            if (interaction.isModalSubmit()) {
                execute = this.hookHandlers.modals.get(
                    interaction.customId.split(':')[0],
                );
                this.logger.verbose(
                    `Matched modal submit interaction handler ${
                        interaction.customId.split(':')[0]
                    }`,
                );
            }
            if (execute) {
                this.logger.info(`Responding to ${details} ${source}`);
                await execute(interaction);
                return;
            }
            this.logger.warn(`Ignoring ${details} ${source}`);
        };
        this.logger.verbose('Hook interaction handler set up');
        // hook our hook interaction handler into the existing event handler for interactionCreate
        this.logger.verbose('Hooking hook interaction handler');
        if (this.hookHandlers.events.has('interactionCreate')) {
            this.hookHandlers.events
                .get('interactionCreate')
                .push(hookInteractionHandler);
        } else {
            this.hookHandlers.events.set('interactionCreate', [
                hookInteractionHandler,
            ]);
        }
        this.logger.verbose('Hooked hook interaction handler');
        // add all the event handlers
        this.logger.verbose('Setting up event handlers');
        this.hookHandlers.events.forEach((eventHandler, key): void => {
            this.addListener(key, async (...args): Promise<void> => {
                for await (const handler of eventHandler) {
                    await handler(...args);
                }
            });
        });
        this.logger.verbose('Event handlers set up');
        this.logger.info('Initialized client');
    }
}
