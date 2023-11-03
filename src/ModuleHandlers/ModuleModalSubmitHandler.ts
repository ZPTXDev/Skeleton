import type { ModalSubmitInteraction } from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericModalSubmitExecuteFunction = (
    interaction: ModalSubmitInteraction,
) => Promise<void> | void;

export class ModuleModalSubmitHandler extends ModuleBaseHandler {
    execute: GenericModalSubmitExecuteFunction;

    setExecute(execute: GenericModalSubmitExecuteFunction): this {
        this.execute = execute;
        return this;
    }
}
