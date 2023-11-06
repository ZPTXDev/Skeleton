import { ModuleMessageCommandHandler } from '../ModuleMessageCommandHandler.js';

describe('ModuleMessageCommandHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleMessageCommandHandler).toEqual('function');
        expect(ModuleMessageCommandHandler.prototype.constructor.name).toEqual(
            'ModuleMessageCommandHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleMessageCommandHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(
            new ModuleMessageCommandHandler().isMessageCommandHandler(),
        ).toBe(true);
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleMessageCommandHandler().isEventHandler()).toBe(false);
        expect(new ModuleMessageCommandHandler().isAutocompleteHandler()).toBe(
            false,
        );
        expect(new ModuleMessageCommandHandler().isButtonHandler()).toBe(false);
        expect(new ModuleMessageCommandHandler().isCommandHandler()).toBe(
            false,
        );
        expect(new ModuleMessageCommandHandler().isMenuCommandHandler()).toBe(
            false,
        );
        expect(new ModuleMessageCommandHandler().isModalSubmitHandler()).toBe(
            false,
        );
        expect(new ModuleMessageCommandHandler().isSelectMenuHandler()).toBe(
            false,
        );
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(
                typeof ModuleMessageCommandHandler.prototype.setExecute,
            ).toEqual('function');
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleMessageCommandHandler();
            expect(
                instance.setExecute((message): void => {
                    message;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(
                typeof ModuleMessageCommandHandler.prototype.validate,
            ).toEqual('function');
        });
        test('returns true if execute is a function', (): void => {
            const instance = new ModuleMessageCommandHandler();
            instance.setExecute((message): void => {
                message;
            });
            expect(instance.validate()).toBe(true);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleMessageCommandHandler();
            expect(instance.validate()).toBe(false);
        });
    });
});
