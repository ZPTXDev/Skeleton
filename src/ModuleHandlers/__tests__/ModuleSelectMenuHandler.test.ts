import { ModuleSelectMenuHandler } from '../ModuleSelectMenuHandler.js';

describe('ModuleSelectMenuHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleSelectMenuHandler).toEqual('function');
        expect(ModuleSelectMenuHandler.prototype.constructor.name).toEqual(
            'ModuleSelectMenuHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleSelectMenuHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleSelectMenuHandler().isSelectMenuHandler()).toBe(true);
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleSelectMenuHandler().isEventHandler()).toBe(false);
        expect(new ModuleSelectMenuHandler().isAutocompleteHandler()).toBe(
            false,
        );
        expect(new ModuleSelectMenuHandler().isButtonHandler()).toBe(false);
        expect(new ModuleSelectMenuHandler().isCommandHandler()).toBe(false);
        expect(new ModuleSelectMenuHandler().isMenuCommandHandler()).toBe(
            false,
        );
        expect(new ModuleSelectMenuHandler().isMessageCommandHandler()).toBe(
            false,
        );
        expect(new ModuleSelectMenuHandler().isModalSubmitHandler()).toBe(
            false,
        );
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleSelectMenuHandler.prototype.setExecute).toEqual(
                'function',
            );
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleSelectMenuHandler();
            expect(
                instance.setExecute((interaction): void => {
                    interaction;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleSelectMenuHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if execute is a function', (): void => {
            const instance = new ModuleSelectMenuHandler();
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toBe(true);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleSelectMenuHandler();
            expect(instance.validate()).toBe(false);
        });
    });
});
