import type { AnySelectMenuInteraction } from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericSelectMenuExecuteFunction = (
    interaction: AnySelectMenuInteraction,
) => Promise<void> | void;

export class ModuleSelectMenuHandler extends ModuleBaseHandler {
    execute: GenericSelectMenuExecuteFunction;

    setExecute(execute: GenericSelectMenuExecuteFunction): this {
        this.execute = execute;
        return this;
    }
}
