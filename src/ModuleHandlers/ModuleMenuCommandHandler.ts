import {
    ContextMenuCommandBuilder,
    type ContextMenuCommandInteraction,
} from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericMenuCommandExecuteFunction = (
    interaction: ContextMenuCommandInteraction,
) => Promise<void> | void;

export class ModuleMenuCommandHandler extends ModuleBaseHandler {
    data: ContextMenuCommandBuilder;
    execute: GenericMenuCommandExecuteFunction;

    setData(data: ContextMenuCommandBuilder): this {
        this.data = data;
        return this;
    }

    setExecute(execute: GenericMenuCommandExecuteFunction): this {
        this.execute = execute;
        return this;
    }

    validate(): boolean {
        return (
            this.data instanceof ContextMenuCommandBuilder &&
            typeof this.execute === 'function'
        );
    }
}
