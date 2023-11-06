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
    private type: string = this.constructor.name;

    abstract setExecute(execute: GenericExecuteFunction): this;

    validate(): boolean {
        return typeof this.execute === 'function';
    }

    isEventHandler(): this is ModuleEventHandler {
        return this.type === 'ModuleEventHandler';
    }

    isAutocompleteHandler(): this is ModuleAutocompleteHandler {
        return this.type === 'ModuleAutocompleteHandler';
    }

    isButtonHandler(): this is ModuleButtonHandler {
        return this.type === 'ModuleButtonHandler';
    }

    isCommandHandler(): this is ModuleCommandHandler {
        return this.type === 'ModuleCommandHandler';
    }

    isMenuCommandHandler(): this is ModuleMenuCommandHandler {
        return this.type === 'ModuleMenuCommandHandler';
    }

    isModalSubmitHandler(): this is ModuleModalSubmitHandler {
        return this.type === 'ModuleModalSubmitHandler';
    }

    isSelectMenuHandler(): this is ModuleSelectMenuHandler {
        return this.type === 'ModuleSelectMenuHandler';
    }

    isMessageCommandHandler(): this is ModuleMessageCommandHandler {
        return this.type === 'ModuleMessageCommandHandler';
    }
}
