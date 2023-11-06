import {
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
} from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericCommandExecuteFunction = (
    interaction: ChatInputCommandInteraction,
) => Promise<void> | void;

export class ModuleCommandHandler extends ModuleBaseHandler {
    data: SlashCommandBuilder;
    execute: GenericCommandExecuteFunction;

    /**
     * Sets the SlashCommandBuilder data for this handler.
     * @param data - The SlashCommandBuilder data.
     * @returns This instance for chaining.
     */
    setData(data: SlashCommandBuilder): this {
        this.data = data;
        return this;
    }

    setExecute(execute: GenericCommandExecuteFunction): this {
        this.execute = execute;
        return this;
    }

    /**
     * Validates the handler, ensuring the SlashCommandBuilder data and execute function are set.
     * @returns Whether the handler is valid.
     */
    validate(): boolean {
        return (
            this.data instanceof SlashCommandBuilder &&
            typeof this.execute === 'function'
        );
    }
}
