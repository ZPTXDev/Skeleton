import { ModuleEventHandler } from '../ModuleEventHandler.js';

describe('ModuleEventHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleEventHandler).toEqual('function');
        expect(ModuleEventHandler.prototype.constructor.name).toEqual(
            'ModuleEventHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleEventHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleEventHandler().isEventHandler()).toBe(true);
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleEventHandler().isAutocompleteHandler()).toBe(false);
        expect(new ModuleEventHandler().isButtonHandler()).toBe(false);
        expect(new ModuleEventHandler().isCommandHandler()).toBe(false);
        expect(new ModuleEventHandler().isMenuCommandHandler()).toBe(false);
        expect(new ModuleEventHandler().isModalSubmitHandler()).toBe(false);
        expect(new ModuleEventHandler().isSelectMenuHandler()).toBe(false);
        expect(new ModuleEventHandler().isMessageCommandHandler()).toBe(false);
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleEventHandler.prototype.setExecute).toEqual(
                'function',
            );
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleEventHandler();
            expect(
                instance.setExecute((eventArgs): void => {
                    eventArgs;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleEventHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if execute is a function', (): void => {
            const instance = new ModuleEventHandler();
            instance.setExecute((eventArgs): void => {
                eventArgs;
            });
            expect(instance.validate()).toBe(true);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleEventHandler();
            expect(instance.validate()).toBe(false);
        });
    });
});
