import { getAbsoluteFileURL } from '@zptxdev/zptx-lib';
import {
    Client,
    Collection,
    GatewayIntentBits,
    type ClientOptions,
    type Message,
    type RESTPostAPIChatInputApplicationCommandsJSONBody,
    type SlashCommandBuilder,
} from 'discord.js';
import { readdirSync } from 'fs';
import type { Logger } from 'winston';
import {
    InteractionHandler,
    MessageHandler,
    type AcceptedInteraction,
} from './InternalHandlers/index.js';
import { logger, type LoggerObject } from './Logger.js';
import { ModuleBaseHandler } from './ModuleHandlers/ModuleBaseHandler.js';
import {
    ModuleEventHandler,
    type ModuleAutocompleteHandler,
    type ModuleButtonHandler,
    type ModuleCommandHandler,
    type ModuleMenuCommandHandler,
    type ModuleMessageCommandHandler,
    type ModuleModalSubmitHandler,
    type ModuleSelectMenuHandler,
} from './ModuleHandlers/index.js';

const SkeletonLabel = 'Skeleton';
const mentionPrefix = '@mention ';

export type InteractionHandlersObject = {
    autocomplete: Collection<string, ModuleAutocompleteHandler>;
    button: Collection<string, ModuleButtonHandler>;
    command: Collection<string, ModuleCommandHandler>;
    menuCommand: Collection<string, ModuleMenuCommandHandler>;
    modalSubmit: Collection<string, ModuleModalSubmitHandler>;
    selectMenu: Collection<string, ModuleSelectMenuHandler>;
};

export class SkeletonClient extends Client {
    private initialized = false;
    // One interaction name can only have one handler
    protected interactionHandlers: InteractionHandlersObject = {
        autocomplete: new Collection<string, ModuleAutocompleteHandler>(),
        button: new Collection<string, ModuleButtonHandler>(),
        command: new Collection<string, ModuleCommandHandler>(),
        menuCommand: new Collection<string, ModuleMenuCommandHandler>(),
        modalSubmit: new Collection<string, ModuleModalSubmitHandler>(),
        selectMenu: new Collection<string, ModuleSelectMenuHandler>(),
    };
    protected messageCommandHandlers = new Collection<
        string,
        ModuleMessageCommandHandler
    >();
    /** Command data stored internally for use in deploying commands */
    private commandData: SlashCommandBuilder[] = [];
    // One event can have multiple handlers
    protected eventHandlers = new Collection<string, ModuleEventHandler[]>();
    private verbose = process.argv
        .slice(2)
        .map((argv): string => argv.toLowerCase())
        .includes('--verbose');
    private deploy = process.argv
        .slice(2)
        .map((argv): string => argv.toLowerCase())
        .includes('--deploy');
    private prefix: string[] = [];
    /** Internal logger */
    private _logger: LoggerObject = {
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
    logger: LoggerObject;

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
    constructor(options: ClientOptions, appName?: string);
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
     *     { appName: 'MusicBot', prefix: 'm!' }
     * );
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
     *     { appName: 'MusicBot', prefix: ['musicbot ', '@mention ', 'm!'] }
     * );
     * @param options - discord.js ClientOptions
     * @param appOptions - Options for the application
     */
    constructor(
        options: ClientOptions,
        appOptions: { appName?: string; prefix?: string | string[] },
    );
    constructor(
        options: ClientOptions,
        appNameOrOptions?:
            | string
            | { appName?: string; prefix?: string | string[] },
    ) {
        super(options);
        let appName: string = undefined;
        appName =
            typeof appNameOrOptions === 'string'
                ? appNameOrOptions
                : appNameOrOptions?.appName;
        if (typeof appNameOrOptions !== 'string' && appNameOrOptions?.prefix) {
            this.prefix = Array.isArray(appNameOrOptions.prefix)
                ? appNameOrOptions.prefix
                : [appNameOrOptions.prefix];
            if (
                !this.options.intents.has([
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                ])
            ) {
                this._logger.warn(
                    'The built-in message command handler was enabled as at least one prefix was specified. However, the client was instantiated without the Guilds and/or Guild Messages intent(s) and may not receive messages from servers.',
                );
            }
            if (!this.options.intents.has(GatewayIntentBits.DirectMessages)) {
                this._logger.warn(
                    'The built-in message command handler was enabled as at least one prefix was specified. However, the client was instantiated without the Direct Messages intent and may not receive messages through DMs.',
                );
            }
            // If there are any non-mention prefixes and a missing MessageContent intent, inform the user
            if (
                this.prefix.filter(
                    (prefix): boolean => prefix !== mentionPrefix,
                ).length > 0 &&
                !this.options.intents.has(GatewayIntentBits.MessageContent)
            ) {
                this._logger.warn(
                    'The built-in message command handler was enabled as at least one prefix was specified. However, the client was instantiated without the Message Content intent and may not be able to access message content, preventing it from responding correctly.',
                );
            }
        }
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

    async login(token: string): Promise<string> {
        const login = await super.login(token);
        if (this.isReady() && this.prefix.includes(mentionPrefix)) {
            this._logger.verbose(
                'Updating placeholder mention prefix with actual mention',
            );
            this.prefix[
                this.prefix.indexOf(mentionPrefix)
            ] = `<@${this.user.id}> `;
        }
        if (this.isReady() && this.deploy) {
            this._logger.verbose(
                'Triggering command deployment because --deploy flag is set',
            );
            await this.deployCommands();
        }
        return login;
    }

    /**
     * Initialize the client, sets up the event handlers
     * @example
     * await client.initialize(import.meta.url);
     * client.login(process.env.DISCORD_BOT_TOKEN);
     * @param baseURL - The base URL (usually import.meta.url) of the main/index file
     */
    async initialize(baseURL: string): Promise<void> {
        if (this.initialized) {
            throw new Error('Client has already been initialized');
        }
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
                    'MenuCommand',
                    'ModalSubmit',
                    'SelectMenu',
                    'Event',
                    'MessageCommand',
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
                        default: handlerData,
                    }: { default: ModuleBaseHandler } = await import(
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
                        | 'event'
                        | 'messageCommand';
                    /** Handler name without file extension */
                    const handlerName = handler.slice(0, -3);
                    // If it's an event handler, add it to the event handlers collection
                    if (
                        camelCaseHandlerType === 'event' &&
                        handlerData.isEventHandler()
                    ) {
                        let eventHandlers: ModuleEventHandler[] = [];
                        // Event already exists in the collection
                        if (this.eventHandlers.has(handlerName)) {
                            eventHandlers = this.eventHandlers.get(handlerName);
                        }
                        // Add the handler to the collection
                        eventHandlers.push(handlerData);
                        this.eventHandlers.set(handlerName, eventHandlers);
                    } else if (
                        camelCaseHandlerType === 'messageCommand' &&
                        handlerData.isMessageCommandHandler()
                    ) {
                        if (this.messageCommandHandlers.has(handlerName)) {
                            this._logger.warn(
                                `Error loading ${module} > ${handlerType} > ${handler}: Handler name is conflicting with a previously loaded handler of the same type; skipping`,
                            );
                            continue;
                        }
                        this.messageCommandHandlers.set(
                            handlerName,
                            handlerData,
                        );
                    } else if (
                        camelCaseHandlerType === 'command' &&
                        handlerData.isCommandHandler()
                    ) {
                        if (
                            this.commandData.some(
                                (data): boolean =>
                                    data.name === handlerData.data.name,
                            )
                        ) {
                            this._logger.warn(
                                `Error loading ${module} > ${handlerType} > ${handler}: Slash command data is conflicting with a previously loaded slash command; skipping`,
                            );
                            continue;
                        }
                        // Add the command data to the command data array
                        this.commandData.push(handlerData.data);
                    }
                    if (
                        camelCaseHandlerType !== 'event' &&
                        !handlerData.isEventHandler() &&
                        camelCaseHandlerType !== 'messageCommand' &&
                        !handlerData.isMessageCommandHandler() &&
                        !(handlerData instanceof ModuleBaseHandler)
                    ) {
                        if (
                            this.interactionHandlers[camelCaseHandlerType].has(
                                handlerName,
                            )
                        ) {
                            this._logger.warn(
                                `Error loading ${module} > ${handlerType} > ${handler}: Handler name is conflicting with a previously loaded handler of the same type; skipping`,
                            );
                            continue;
                        }
                        this.interactionHandlers[camelCaseHandlerType].set(
                            handlerName,
                            handlerData,
                        );
                    }
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
        const interactionHandler = new ModuleEventHandler().setExecute(
            (interaction: AcceptedInteraction): Promise<void> =>
                InteractionHandler({
                    interaction,
                    interactionHandlers: this.interactionHandlers,
                    logger: this._logger,
                }),
        );
        if (this.eventHandlers.has('interactionCreate')) {
            this.eventHandlers
                .get('interactionCreate')
                .push(interactionHandler);
        } else {
            this.eventHandlers.set('interactionCreate', [interactionHandler]);
        }
        this._logger.verbose(
            'Added built-in interactionCreate handler to event handlers',
        );
        // Add our message handler to the event handlers if any prefix is specified
        if (this.prefix.length > 0) {
            this._logger.verbose(
                'Adding built-in messageCreate handler to event handlers',
            );
            const messageHandler = new ModuleEventHandler().setExecute(
                (message: Message): Promise<void> =>
                    MessageHandler({
                        message,
                        prefix: this.prefix,
                        messageCommandHandlers: this.messageCommandHandlers,
                        logger: this._logger,
                    }),
            );
            if (this.eventHandlers.has('messageCreate')) {
                this.eventHandlers.get('messageCreate').push(messageHandler);
            } else {
                this.eventHandlers.set('messageCreate', [messageHandler]);
            }
            this._logger.verbose(
                'Added built-in messageCreate handler to event handlers',
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

    /**
     * Deletes application commands. Only use after you've logged in to Discord.
     */
    async deleteCommands(): Promise<void> {
        if (!this.isReady()) {
            throw new Error(
                'You must log in to Discord before deleting commands',
            );
        }
        this._logger.info('Deleting commands');
        await this.application.commands.set([]);
        this._logger.info('Deleted commands');
    }
}
