import { ModuleAutocompleteHandler } from '../ModuleAutocompleteHandler.js';

describe('ModuleAutocompleteHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleAutocompleteHandler).toEqual('function');
        expect(ModuleAutocompleteHandler.prototype.constructor.name).toEqual(
            'ModuleAutocompleteHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleAutocompleteHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleAutocompleteHandler().isAutocompleteHandler()).toBe(
            true,
        );
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleAutocompleteHandler().isUnconfiguredHandler()).toBe(
            false,
        );
        expect(new ModuleAutocompleteHandler().isEventHandler()).toBe(false);
        expect(new ModuleAutocompleteHandler().isButtonHandler()).toBe(false);
        expect(new ModuleAutocompleteHandler().isCommandHandler()).toBe(false);
        expect(new ModuleAutocompleteHandler().isMenuCommandHandler()).toBe(
            false,
        );
        expect(new ModuleAutocompleteHandler().isModalSubmitHandler()).toBe(
            false,
        );
        expect(new ModuleAutocompleteHandler().isSelectMenuHandler()).toBe(
            false,
        );
        expect(new ModuleAutocompleteHandler().isMessageCommandHandler()).toBe(
            false,
        );
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(
                typeof ModuleAutocompleteHandler.prototype.setExecute,
            ).toEqual('function');
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleAutocompleteHandler();
            expect(
                instance.setExecute((interaction): void => {
                    interaction;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleAutocompleteHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if execute is a function', (): void => {
            const instance = new ModuleAutocompleteHandler();
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toBe(true);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleAutocompleteHandler();
            expect(instance.validate()).toBe(false);
        });
    });
});
