import {
    ModuleBaseHandler,
    type GenericExecuteFunction,
} from './ModuleBaseHandler.js';

export class ModuleEventHandler extends ModuleBaseHandler {
    once = false;
    execute: GenericExecuteFunction;

    setOnce(once: boolean): this {
        this.once = once;
        return this;
    }

    setExecute(execute: GenericExecuteFunction): this {
        this.execute = execute;
        return this;
    }

    validate(): boolean {
        return (
            typeof this.once === 'boolean' && typeof this.execute === 'function'
        );
    }
}
