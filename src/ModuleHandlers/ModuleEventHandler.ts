import {
    ModuleBaseHandler,
    type GenericExecuteFunction,
} from './ModuleBaseHandler.js';

export class ModuleEventHandler extends ModuleBaseHandler {
    once = false;
    execute: GenericExecuteFunction;

    /**
     * Set whether this event handler should only be called once.
     * @param once - Whether this event handler should only be called once.
     * @returns This instance for chaining.
     */
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
