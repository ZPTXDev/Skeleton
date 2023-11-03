import type { AutocompleteInteraction } from 'discord.js';
import { ModuleBaseHandler } from './ModuleBaseHandler.js';

type GenericAutocompleteExecuteFunction = (
    interaction: AutocompleteInteraction,
) => Promise<void> | void;

export class ModuleAutocompleteHandler extends ModuleBaseHandler {
    execute: GenericAutocompleteExecuteFunction;

    setExecute(execute: GenericAutocompleteExecuteFunction): this {
        this.execute = execute;
        return this;
    }
}
