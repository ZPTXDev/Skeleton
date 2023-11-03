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

    setData(data: SlashCommandBuilder): this {
        this.data = data;
        return this;
    }

    setExecute(execute: GenericCommandExecuteFunction): this {
        this.execute = execute;
        return this;
    }

    validate(): boolean {
        return (
            this.data instanceof SlashCommandBuilder &&
            typeof this.execute === 'function'
        );
    }
}
