import {
    ApplicationCommandOptionType,
    type ChatInputCommandInteraction,
    type CommandInteraction,
} from 'discord.js';

/**
 * Extract command details from a ChatInputCommandInteraction, including the subcommand group and subcommand in the name and removing them from options if applicable.
 * @param interaction - The interaction to extract the command details from.
 * @returns The command details.
 */
export function extractCommandDetails(
    interaction: ChatInputCommandInteraction,
): {
    commandName: string;
    options: CommandInteraction['options']['data'];
} {
    let commandName = interaction.commandName;
    let options = interaction.options?.data;
    if (options?.length > 0) {
        while (
            options[0]?.type === ApplicationCommandOptionType.Subcommand ||
            options[0]?.type === ApplicationCommandOptionType.SubcommandGroup
        ) {
            commandName += ` ${options[0].name}`;
            options = options[0].options;
        }
    }
    return { commandName, options };
}
