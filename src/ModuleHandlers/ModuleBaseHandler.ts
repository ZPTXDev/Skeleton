import type {
    ModuleAutocompleteHandler,
    ModuleButtonHandler,
    ModuleCommandHandler,
    ModuleEventHandler,
    ModuleMenuCommandHandler,
    ModuleMessageCommandHandler,
    ModuleModalSubmitHandler,
    ModuleSelectMenuHandler,
} from './index.js';

export type GenericExecuteFunction = (
    ...args: unknown[]
) => Promise<void> | void;

export abstract class ModuleBaseHandler {
    abstract execute: GenericExecuteFunction;
    readonly type: string = this.constructor.name;

    /**
     * Sets the execute function for this handler.
     * @param execute - The execute function.
     * @returns This instance for chaining.
     */
    abstract setExecute(execute: GenericExecuteFunction): this;

    /**
     * Validates the handler, ensuring the execute function is set.
     * @returns Whether the handler is valid.
     */
    validate(): boolean {
        return typeof this.execute === 'function';
    }

    /**
     * Checks if this handler is an unconfigured handler.
     * @returns Whether this handler is an unconfigured handler.
     */
    isUnconfiguredHandler(): this is ModuleBaseHandler {
        return this.type === 'ModuleBaseHandler';
    }

    /**
     * Checks if this handler is an event handler.
     * @returns Whether this handler is an event handler.
     */
    isEventHandler(): this is ModuleEventHandler {
        return this.type === 'ModuleEventHandler';
    }

    /**
     * Checks if this handler is an autocomplete handler.
     * @returns Whether this handler is an autocomplete handler.
     */
    isAutocompleteHandler(): this is ModuleAutocompleteHandler {
        return this.type === 'ModuleAutocompleteHandler';
    }

    /**
     * Checks if this handler is a button handler.
     * @returns Whether this handler is a button handler.
     */
    isButtonHandler(): this is ModuleButtonHandler {
        return this.type === 'ModuleButtonHandler';
    }

    /**
     * Checks if this handler is a command handler.
     * @returns Whether this handler is a command handler.
     */
    isCommandHandler(): this is ModuleCommandHandler {
        return this.type === 'ModuleCommandHandler';
    }

    /**
     * Checks if this handler is a menu command handler.
     * @returns Whether this handler is a menu command handler.
     */
    isMenuCommandHandler(): this is ModuleMenuCommandHandler {
        return this.type === 'ModuleMenuCommandHandler';
    }

    /**
     * Checks if this handler is a modal submit handler.
     * @returns Whether this handler is a modal submit handler.
     */
    isModalSubmitHandler(): this is ModuleModalSubmitHandler {
        return this.type === 'ModuleModalSubmitHandler';
    }

    /**
     * Checks if this handler is a select menu handler.
     * @returns Whether this handler is a select menu handler.
     */
    isSelectMenuHandler(): this is ModuleSelectMenuHandler {
        return this.type === 'ModuleSelectMenuHandler';
    }

    /**
     * Checks if this handler is a message command handler.
     * @returns Whether this handler is a message command handler.
     */
    isMessageCommandHandler(): this is ModuleMessageCommandHandler {
        return this.type === 'ModuleMessageCommandHandler';
    }
}
