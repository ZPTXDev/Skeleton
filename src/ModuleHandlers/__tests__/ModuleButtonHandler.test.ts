import { ModuleButtonHandler } from '../ModuleButtonHandler.js';

describe('ModuleButtonHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleButtonHandler).toEqual('function');
        expect(ModuleButtonHandler.prototype.constructor.name).toEqual(
            'ModuleButtonHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleButtonHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleButtonHandler().isButtonHandler()).toBe(true);
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleButtonHandler().isEventHandler()).toBe(false);
        expect(new ModuleButtonHandler().isAutocompleteHandler()).toBe(false);
        expect(new ModuleButtonHandler().isCommandHandler()).toBe(false);
        expect(new ModuleButtonHandler().isMenuCommandHandler()).toBe(false);
        expect(new ModuleButtonHandler().isModalSubmitHandler()).toBe(false);
        expect(new ModuleButtonHandler().isSelectMenuHandler()).toBe(false);
        expect(new ModuleButtonHandler().isMessageCommandHandler()).toBe(false);
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleButtonHandler.prototype.setExecute).toEqual(
                'function',
            );
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleButtonHandler();
            expect(
                instance.setExecute((interaction): void => {
                    interaction;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleButtonHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if execute is a function', (): void => {
            const instance = new ModuleButtonHandler();
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toBe(true);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleButtonHandler();
            expect(instance.validate()).toBe(false);
        });
    });
});
