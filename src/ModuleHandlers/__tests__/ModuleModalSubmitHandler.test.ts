import { ModuleModalSubmitHandler } from '../ModuleModalSubmitHandler.js';

describe('ModuleModalSubmitHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleModalSubmitHandler).toEqual('function');
        expect(ModuleModalSubmitHandler.prototype.constructor.name).toEqual(
            'ModuleModalSubmitHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleModalSubmitHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleModalSubmitHandler().isModalSubmitHandler()).toBe(
            true,
        );
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleModalSubmitHandler().isUnconfiguredHandler()).toBe(
            false,
        );
        expect(new ModuleModalSubmitHandler().isEventHandler()).toBe(false);
        expect(new ModuleModalSubmitHandler().isAutocompleteHandler()).toBe(
            false,
        );
        expect(new ModuleModalSubmitHandler().isButtonHandler()).toBe(false);
        expect(new ModuleModalSubmitHandler().isCommandHandler()).toBe(false);
        expect(new ModuleModalSubmitHandler().isMenuCommandHandler()).toBe(
            false,
        );
        expect(new ModuleModalSubmitHandler().isMessageCommandHandler()).toBe(
            false,
        );
        expect(new ModuleModalSubmitHandler().isSelectMenuHandler()).toBe(
            false,
        );
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(
                typeof ModuleModalSubmitHandler.prototype.setExecute,
            ).toEqual('function');
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleModalSubmitHandler();
            expect(
                instance.setExecute((interaction): void => {
                    interaction;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleModalSubmitHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if execute is a function', (): void => {
            const instance = new ModuleModalSubmitHandler();
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toBe(true);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleModalSubmitHandler();
            expect(instance.validate()).toBe(false);
        });
    });
});
