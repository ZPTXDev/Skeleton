import type { Message } from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericMessageCommandExecuteFunction = (
    message: Message,
) => Promise<void> | void;

export class ModuleMessageCommandHandler extends ModuleBaseHandler {
    execute: GenericMessageCommandExecuteFunction;

    setExecute(execute: GenericMessageCommandExecuteFunction): this {
        this.execute = execute;
        return this;
    }
}
