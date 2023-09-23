import { getAbsoluteFileURL } from '@zptxdev/zptx-lib';
import type {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ClientOptions,
    CommandInteraction,
    ModalSubmitInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SlashCommandBuilder,
} from 'discord.js';
import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import type { Logger } from 'winston';
import { logger } from './Logger.js';
import { extractCommandDetails } from './utils.js';

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
 * Placeholder logger function
 */
type LoggerFunction = (message: string) => Logger;

/**
 * The accepted interaction types
 */
type AcceptedInteraction =
    | AutocompleteInteraction
    | ButtonInteraction
    | CommandInteraction
    | ModalSubmitInteraction
    | AnySelectMenuInteraction;

const SkeletonLabel = 'Skeleton';

export class SkeletonClient extends Client {
    private initialized = false;
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
    /** Command data stored internally for use in deploying commands */
    private commandData: SlashCommandBuilder[] = [];
    // One event can have multiple handlers
    protected eventHandlers = new Collection<string, EventObject[]>();
    private verbose = process.argv
        .slice(2)
        .map((argv): string => argv.toLowerCase())
        .includes('--verbose');
    private deploy = process.argv
        .slice(2)
        .map((argv): string => argv.toLowerCase())
        .includes('--deploy');
    /** Internal logger */
    private _logger: { [key: string]: LoggerFunction } = {
        error: (message): Logger =>
            logger.error({ message, label: SkeletonLabel }),
        warn: (message): Logger =>
            logger.warn({ message, label: SkeletonLabel }),
        info: (message): Logger =>
            logger.info({ message, label: SkeletonLabel }),
        verbose: (message): Logger =>
            this.verbose
                ? logger.verbose({ message, label: SkeletonLabel })
                : logger,
    };
    logger: {
        error: LoggerFunction;
        warn: LoggerFunction;
        info: LoggerFunction;
        verbose: LoggerFunction;
    };

    /**
     * Creates an instance of SkeletonClient.
     * @example
     * const client = new SkeletonClient(
     *     {
     *         intents: [
     *             GatewayIntentBits.Guilds,
     *         ],
     *         partials: [
     *             Partials.Channel
     *         ],
     *     },
     *     'MusicBot'
     * );
     * @param options - discord.js ClientOptions
     * @param appName - The name of the application
     */
    constructor(options: ClientOptions, appName?: string) {
        super(options);
        this.logger = {
            error: (message, label = appName): Logger =>
                logger.error({ message, label }),
            warn: (message, label = appName): Logger =>
                logger.warn({ message, label }),
            info: (message, label = appName): Logger =>
                logger.info({ message, label }),
            verbose: (message, label = appName): Logger =>
                this.verbose ? logger.verbose({ message, label }) : logger,
        };
    }

    /**
     * Internal interactionCreate event handler
     * @param interaction - The interaction to handle
     */
    private async interactionHandler(
        interaction: AcceptedInteraction,
    ): Promise<void> {
        let execute: (
            interaction: AcceptedInteraction,
        ) => Promise<void> | undefined;
        const source = `from UID ${interaction.user.id}${
            interaction.inGuild() ? ` in GID ${interaction.guildId}` : ''
        }`;
        let details = '';
        if (interaction.isCommand()) {
            const { commandName, options } = extractCommandDetails(interaction);
            details = `${interaction.constructor.name} /${commandName}${
                options?.length > 0
                    ? ` ${options
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
        if (details) this._logger.info(`Received ${details} ${source}`);
        if (interaction.isAutocomplete()) {
            execute = this.interactionHandlers.autocomplete.get(
                interaction.commandName,
            );
        } else if (interaction.isButton()) {
            execute = this.interactionHandlers.button.get(
                interaction.customId.split(':')[0],
            );
            this._logger.verbose(
                `Matched button handler ${interaction.customId.split(':')[0]}`,
            );
        } else if (interaction.isCommand()) {
            execute = this.interactionHandlers.command.get(
                interaction.commandName,
            );
            this._logger.verbose(
                `Matched command handler /${interaction.commandName}`,
            );
        } else if (interaction.isModalSubmit()) {
            execute = this.interactionHandlers.modalSubmit.get(
                interaction.customId.split(':')[0],
            );
            this._logger.verbose(
                `Matched modal submit handler ${
                    interaction.customId.split(':')[0]
                }`,
            );
        } else if (interaction.isAnySelectMenu()) {
            execute = this.interactionHandlers.selectMenu.get(
                interaction.customId.split(':')[0],
            );
            this._logger.verbose(
                `Matched select menu handler ${
                    interaction.customId.split(':')[0]
                }`,
            );
        }
        if (execute) {
            if (details) {
                this._logger.verbose(`Responding to ${details} ${source}`);
            }
            await execute(interaction);
            return;
        }
        if (details) this._logger.warn(`Ignoring ${details} ${source}`);
    }

    /**
     * Internal ready event handler
     */
    private async readyHandler(): Promise<void> {
        this._logger.info(
            'Triggering command deployment because --deploy flag is set',
        );
        await this.deployCommands();
    }

    /**
     * Initialize the client, sets up the event handlers
     * @example
     * await client.initialize(import.meta.url);
     * client.login(process.env.DISCORD_BOT_TOKEN);
     * @param baseURL - The base URL (usually import.meta.url) of the main/index file
     */
    async initialize(baseURL: string): Promise<void> {
        this._logger.info('Initializing client');
        // Find all modules within the modules directory
        /** Modules (all folders in the 'modules' directory) */
        const modules = readdirSync(getAbsoluteFileURL(baseURL, ['modules']));
        this._logger.verbose('Loading modules');
        for await (const module of modules) {
            this._logger.verbose(
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
                this._logger.verbose(
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
                    this._logger.verbose(
                        `Loading ${module} > ${handlerType} > ${handler} (${
                            handlers.indexOf(handler) + 1
                        }/${handlers.length})`,
                    );
                    // Import it and add it to the relevant collection
                    const {
                        execute: handlerExecute,
                        once: handlerOnce = false,
                        data: handlerData,
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
                    if (camelCaseHandlerType === 'command') {
                        // Add the command data to the command data array
                        this.commandData.push(handlerData);
                    }
                    // Otherwise, add it to the relevant interaction handlers collection
                    this.interactionHandlers[camelCaseHandlerType].set(
                        handlerName,
                        handlerExecute,
                    );
                    this._logger.verbose(
                        `Loaded ${module} > ${handlerType} > ${handler}`,
                    );
                }
                this._logger.verbose(`Loaded ${module} > ${handlerType}`);
            }
            this._logger.verbose(`Loaded ${module}`);
        }
        this._logger.verbose('Loaded modules');
        // Add our interaction handler to the event handlers
        this._logger.verbose(
            'Adding built-in interactionCreate handler to event handlers',
        );
        const interactionHandlerObject = {
            once: false,
            execute: this.interactionHandler,
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
        this._logger.verbose(
            'Added built-in interactionCreate handler to event handlers',
        );
        // Add our ready handler to the event handlers if deploy flag is set
        if (this.deploy) {
            this._logger.verbose(
                'Adding built-in ready handler to event handlers',
            );
            const readyHandlerObject = {
                once: true,
                execute: this.readyHandler,
            };
            if (this.eventHandlers.has('ready')) {
                this.eventHandlers.get('ready').push(readyHandlerObject);
            } else {
                this.eventHandlers.set('ready', [readyHandlerObject]);
            }
            this._logger.verbose(
                'Added built-in ready handler to event handlers',
            );
        }
        // Add all the event handlers
        this._logger.verbose('Setting up event handlers');
        this.eventHandlers.forEach((eventHandler, key): void => {
            eventHandler.forEach((handler): void => {
                if (handler.once) {
                    this.once(key, handler.execute);
                    return;
                }
                this.on(key, handler.execute);
            });
        });
        this._logger.verbose('Event handlers set up');
        this._logger.info('Initialized client');
        this.initialized = true;
    }

    /**
     * Deploys application commands. Only use after you've initialized the client and logged in to Discord.
     */
    async deployCommands(): Promise<void> {
        if (!this.initialized) {
            throw new Error(
                'You must initialize the client before deploying commands',
            );
        }
        if (!this.isReady()) {
            throw new Error(
                'You must log in to Discord before deploying commands',
            );
        }
        this._logger.info('Deploying commands');
        await this.application.commands.set(
            this.commandData.map(
                (data): RESTPostAPIChatInputApplicationCommandsJSONBody =>
                    data.toJSON(),
            ),
        );
        this._logger.info('Deployed commands');
    }
}
