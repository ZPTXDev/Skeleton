import { getAbsoluteFileURL } from '@zptxdev/zptx-lib';
import type {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ClientOptions,
    CommandInteraction,
    ModalSubmitInteraction,
} from 'discord.js';
import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import type { Logger } from 'winston';
import { logger } from './Logger.js';

/**
 * Placeholder event handler function
 */
type EventHandler = (...args: unknown[]) => Promise<void>;

/**
 * Placeholder event object
 */
type EventObject = {
    once?: boolean;
    execute: EventHandler;
};

/**
 * The accepted interaction types
 */
type AcceptedInteraction =
    | AutocompleteInteraction
    | ButtonInteraction
    | CommandInteraction
    | ModalSubmitInteraction
    | AnySelectMenuInteraction;

export class SkeletonClient extends Client {
    // One interaction name can only have one handler
    protected interactionHandlers = {
        autocomplete: new Collection<
            string,
            (interaction: AutocompleteInteraction) => Promise<void>
        >(),
        button: new Collection<
            string,
            (interaction: ButtonInteraction) => Promise<void>
        >(),
        command: new Collection<
            string,
            (interaction: CommandInteraction) => Promise<void>
        >(),
        modalSubmit: new Collection<
            string,
            (interaction: ModalSubmitInteraction) => Promise<void>
        >(),
        selectMenu: new Collection<
            string,
            (interaction: AnySelectMenuInteraction) => Promise<void>
        >(),
    };
    // One event can have multiple handlers
    protected eventHandlers = new Collection<string, EventObject[]>();
    private verbose = process.argv
        .slice(2)
        .map((argv): string => argv.toLowerCase())
        .includes('--verbose');
    logger: {
        error: (message: string) => Logger;
        warn: (message: string) => Logger;
        info: (message: string) => Logger;
        verbose: (message: string) => Logger;
    };

    /**
     * Creates an instance of SkeletonClient.
     * @example
     * const client = new SkeletonClient(
     *     {
     *         intents: [
     *             GatewayIntentBits.Guilds,
     *         ],
     *     },
     * );
     * @param options - discord.js ClientOptions
     */
    constructor(options: ClientOptions) {
        super(options);
        const defaultLabel = 'Skeleton';
        this.logger = {
            error: (message, label = defaultLabel): Logger =>
                logger.error({ message, label }),
            warn: (message, label = defaultLabel): Logger =>
                logger.warn({ message, label }),
            info: (message, label = defaultLabel): Logger =>
                logger.info({ message, label }),
            verbose: (message, label = defaultLabel): Logger =>
                this.verbose ? logger.verbose({ message, label }) : logger,
        };
    }

    /**
     * Initialize the client, sets up the event handlers
     * @example
     * await client.initialize(import.meta.url);
     * client.login(process.env.DISCORD_BOT_TOKEN);
     * @param baseURL - The base URL (usually import.meta.url) of the main/index file
     */
    async initialize(baseURL: string): Promise<void> {
        this.logger.info('Initializing client');
        // Find all modules within the modules directory
        /** Modules (all folders in the 'modules' directory) */
        const modules = readdirSync(getAbsoluteFileURL(baseURL, ['modules']));
        this.logger.verbose('Loading modules');
        for await (const module of modules) {
            this.logger.verbose(
                `Loading ${module} (${modules.indexOf(module) + 1}/${
                    modules.length
                })`,
            );
            // For each module, look for the relevant interaction handlers and event handlers
            /** All accepted handler type folders that were found within the module directory */
            const foundAcceptedHandlerTypes = readdirSync(
                getAbsoluteFileURL(baseURL, ['modules', module]),
            ).filter((folder): boolean =>
                [
                    'Autocomplete',
                    'Button',
                    'Command',
                    'ModalSubmit',
                    'SelectMenu',
                    'Event',
                ].includes(folder),
            );
            for await (const handlerType of foundAcceptedHandlerTypes) {
                this.logger.verbose(
                    `Loading ${module} > ${handlerType} (${
                        foundAcceptedHandlerTypes.indexOf(handlerType) + 1
                    }/${foundAcceptedHandlerTypes.length})`,
                );
                // Look for the handlers within the handler type
                /** All handler files containing run functions, etc */
                const handlers = readdirSync(
                    getAbsoluteFileURL(baseURL, [
                        'modules',
                        module,
                        handlerType,
                    ]),
                ).filter(
                    (handler): boolean =>
                        handler.endsWith('.ts') || handler.endsWith('.js'),
                );
                for await (const handler of handlers) {
                    this.logger.verbose(
                        `Loading ${module} > ${handlerType} > ${handler} (${
                            handlers.indexOf(handler) + 1
                        }/${handlers.length})`,
                    );
                    // Import it and add it to the relevant collection
                    const {
                        execute: handlerExecute,
                        once: handlerOnce = false,
                    } = await import(
                        getAbsoluteFileURL(baseURL, [
                            'modules',
                            module,
                            handlerType,
                            handler,
                        ]).toString()
                    );
                    /** Handler type in camel case */
                    const camelCaseHandlerType = (handlerType
                        .charAt(0)
                        .toLowerCase() + handlerType.slice(1)) as
                        | keyof typeof this.interactionHandlers
                        | 'event';
                    /** Handler name without file extension */
                    const handlerName = handler.slice(0, -3);
                    // If it's an event handler, add it to the event handlers collection
                    if (camelCaseHandlerType === 'event') {
                        let eventHandlers: EventObject[] = [];
                        // Event already exists in the collection
                        if (this.eventHandlers.has(handlerName)) {
                            eventHandlers = this.eventHandlers.get(handlerName);
                        }
                        // Add the handler to the collection
                        eventHandlers.push({
                            once: handlerOnce,
                            execute: handlerExecute,
                        });
                        this.eventHandlers.set(handlerName, eventHandlers);
                        continue;
                    }
                    // Otherwise, add it to the relevant interaction handlers collection
                    this.interactionHandlers[camelCaseHandlerType].set(
                        handlerName,
                        handlerExecute,
                    );
                    this.logger.verbose(
                        `Loaded ${module} > ${handlerType} > ${handler}`,
                    );
                }
                this.logger.verbose(`Loaded ${module} > ${handlerType}`);
            }
            this.logger.verbose(`Loaded ${module}`);
        }
        this.logger.verbose('Loaded modules');
        // Set up our own interactionCreate event handler
        this.logger.verbose('Setting up built-in interactionCreate handler');
        const interactionHandler = async (
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
            } else if (!interaction.isAutocomplete()) {
                details = `${interaction.constructor.name} ${interaction.customId}`;
            }
            if (details) this.logger.info(`Processing ${details} ${source}`);
            if (interaction.isAutocomplete()) {
                execute = this.interactionHandlers.autocomplete.get(
                    interaction.commandName,
                );
            } else if (interaction.isButton()) {
                execute = this.interactionHandlers.button.get(
                    interaction.customId.split(':')[0],
                );
                this.logger.verbose(
                    `Matched button handler ${
                        interaction.customId.split(':')[0]
                    }`,
                );
            } else if (interaction.isCommand()) {
                execute = this.interactionHandlers.command.get(
                    interaction.commandName,
                );
                this.logger.verbose(
                    `Matched command handler /${interaction.commandName}`,
                );
            } else if (interaction.isModalSubmit()) {
                execute = this.interactionHandlers.modalSubmit.get(
                    interaction.customId.split(':')[0],
                );
                this.logger.verbose(
                    `Matched modal submit handler ${
                        interaction.customId.split(':')[0]
                    }`,
                );
            } else if (interaction.isAnySelectMenu()) {
                execute = this.interactionHandlers.selectMenu.get(
                    interaction.customId.split(':')[0],
                );
                this.logger.verbose(
                    `Matched select menu handler ${
                        interaction.customId.split(':')[0]
                    }`,
                );
            }
            if (execute) {
                if (details) {
                    this.logger.info(`Responding to ${details} ${source}`);
                }
                await execute(interaction);
                return;
            }
            if (details) this.logger.warn(`Ignoring ${details} ${source}`);
        };
        this.logger.verbose('Built-in interactionCreate handler set up');
        // Add our interaction handler to the event handlers
        this.logger.verbose(
            'Adding built-in interactionCreate handler to event handlers',
        );
        const interactionHandlerObject = {
            once: false,
            execute: interactionHandler,
        };
        if (this.eventHandlers.has('interactionCreate')) {
            this.eventHandlers
                .get('interactionCreate')
                .push(interactionHandlerObject);
        } else {
            this.eventHandlers.set('interactionCreate', [
                interactionHandlerObject,
            ]);
        }
        this.logger.verbose(
            'Added built-in interactionCreate handler to event handlers',
        );
        // Add all the event handlers
        this.logger.verbose('Setting up event handlers');
        this.eventHandlers.forEach((eventHandler, key): void => {
            eventHandler.forEach((handler): void => {
                if (handler.once) {
                    this.once(key, handler.execute);
                    return;
                }
                this.on(key, handler.execute);
            });
        });
        this.logger.verbose('Event handlers set up');
        this.logger.info('Initialized client');
    }
}
