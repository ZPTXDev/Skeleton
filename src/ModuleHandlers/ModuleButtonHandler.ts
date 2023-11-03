import type { ButtonInteraction } from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericButtonExecuteFunction = (
    interaction: ButtonInteraction,
) => Promise<void> | void;

export class ModuleButtonHandler extends ModuleBaseHandler {
    execute: GenericButtonExecuteFunction;

    setExecute(execute: GenericButtonExecuteFunction): this {
        this.execute = execute;
        return this;
    }
}
