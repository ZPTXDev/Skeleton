import {
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

    abstract setExecute(execute: GenericExecuteFunction): this;

    validate(): boolean {
        return typeof this.execute === 'function';
    }

    isEventHandler(): this is ModuleEventHandler {
        return this instanceof ModuleEventHandler;
    }

    isAutocompleteHandler(): this is ModuleAutocompleteHandler {
        return this instanceof ModuleAutocompleteHandler;
    }

    isButtonHandler(): this is ModuleButtonHandler {
        return this instanceof ModuleButtonHandler;
    }

    isCommandHandler(): this is ModuleCommandHandler {
        return this instanceof ModuleCommandHandler;
    }

    isMenuCommandHandler(): this is ModuleMenuCommandHandler {
        return this instanceof ModuleMenuCommandHandler;
    }

    isModalSubmitHandler(): this is ModuleModalSubmitHandler {
        return this instanceof ModuleModalSubmitHandler;
    }

    isSelectMenuHandler(): this is ModuleSelectMenuHandler {
        return this instanceof ModuleSelectMenuHandler;
    }

    isMessageCommandHandler(): this is ModuleMessageCommandHandler {
        return this instanceof ModuleMessageCommandHandler;
    }
}
