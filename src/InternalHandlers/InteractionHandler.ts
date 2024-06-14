import type {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
    ModalSubmitInteraction,
} from 'discord.js';
import type { LoggerObject } from '../Logger.js';
import type { InteractionHandlersObject } from '../SkeletonClient.js';
import { extractCommandDetails } from '../utils.js';

/**
 * The accepted interaction types
 */
export type AcceptedInteraction =
    | AutocompleteInteraction
    | ButtonInteraction
    | ChatInputCommandInteraction
    | ContextMenuCommandInteraction
    | ModalSubmitInteraction
    | AnySelectMenuInteraction;

type InteractionHandlerOptions = {
    /** The interaction to handle */
    interaction: AcceptedInteraction;
    /** Collection containing interaction handlers */
    interactionHandlers: InteractionHandlersObject;
    /** Internal logger object */
    logger: LoggerObject;
};

/**
 * Internal interactionCreate event handler
 */
export async function InteractionHandler({
    interaction,
    interactionHandlers,
    logger,
}: InteractionHandlerOptions): Promise<void> {
    const source = `from UID ${interaction.user.id}${
        interaction.inGuild() ? ` in GID ${interaction.guildId}` : ''
    }`;
    let details = '',
        verboseLog = '';
    if (interaction.isChatInputCommand()) {
        const { commandName, options } = extractCommandDetails(interaction);
        details = `${interaction.constructor.name} /${commandName}${
            options?.length > 0
                ? ` ${options
                      .map((option): string => `${option.name}:${option.value}`)
                      .join(' ')}`
                : ''
        }`;
    } else if (interaction.isContextMenuCommand()) {
        details = `${interaction.constructor.name} ${interaction.commandName}`;
    } else if (!interaction.isAutocomplete()) {
        details = `${interaction.constructor.name} ${interaction.customId}`;
    }
    // Filters out autocomplete (spammy)
    if (details) logger.info(`Received ${details} ${source}`);
    let type:
            | 'autocomplete'
            | 'button'
            | 'command'
            | 'menuCommand'
            | 'modalSubmit'
            | 'selectMenu',
        key;
    if (interaction.isAutocomplete()) {
        type = 'autocomplete';
        key = interaction.commandName;
    } else if (interaction.isButton()) {
        type = 'button';
        key = interaction.customId.split(':')[0];
        verboseLog = `Matched button handler ${
            interaction.customId.split(':')[0]
        }`;
    } else if (interaction.isChatInputCommand()) {
        type = 'command';
        key = interaction.commandName;
        verboseLog = `Matched command handler /${interaction.commandName}`;
    } else if (interaction.isContextMenuCommand()) {
        type = 'menuCommand';
        key = interaction.commandName;
        verboseLog = `Matched menu command handler ${interaction.commandName}`;
    } else if (interaction.isModalSubmit()) {
        type = 'modalSubmit';
        key = interaction.customId.split(':')[0];
        verboseLog = `Matched modal submit handler ${
            interaction.customId.split(':')[0]
        }`;
    } else if (interaction.isAnySelectMenu()) {
        type = 'selectMenu';
        key = interaction.customId.split(':')[0];
        verboseLog = `Matched select menu handler ${
            interaction.customId.split(':')[0]
        }`;
    }
    const {
        execute,
    }: { execute: (interaction: AcceptedInteraction) => Promise<void> | void } =
        interactionHandlers[type].get(key) ?? { execute: null };
    if (execute) {
        if (verboseLog) logger.verbose(verboseLog);
        if (details) {
            logger.verbose(`Responding to ${details} ${source}`);
        }
        await execute(interaction);
        return;
    }
    if (details) logger.warn(`Ignoring ${details} ${source}`);
}
