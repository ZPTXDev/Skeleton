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

    /**
     * Sets the ContextMenuCommandBuilder data for this handler.
     * @param data - The ContextMenuCommandBuilder data.
     * @returns This instance for chaining.
     */
    setData(data: ContextMenuCommandBuilder): this {
        this.data = data;
        return this;
    }

    setExecute(execute: GenericMenuCommandExecuteFunction): this {
        this.execute = execute;
        return this;
    }

    /**
     * Validates the handler, ensuring the ContextMenuCommandBuilder data and execute function are set.
     * @returns Whether the handler is valid.
     */
    validate(): boolean {
        return (
            this.data instanceof ContextMenuCommandBuilder &&
            typeof this.execute === 'function'
        );
    }
}
