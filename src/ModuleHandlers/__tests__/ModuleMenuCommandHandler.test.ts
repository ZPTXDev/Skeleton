import { ContextMenuCommandBuilder } from 'discord.js';
import { ModuleMenuCommandHandler } from '../ModuleMenuCommandHandler.js';

describe('ModuleMenuCommandHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleMenuCommandHandler).toEqual('function');
        expect(ModuleMenuCommandHandler.prototype.constructor.name).toEqual(
            'ModuleMenuCommandHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleMenuCommandHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleMenuCommandHandler().isMenuCommandHandler()).toBe(
            true,
        );
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleMenuCommandHandler().isUnconfiguredHandler()).toBe(
            false,
        );
        expect(new ModuleMenuCommandHandler().isEventHandler()).toBe(false);
        expect(new ModuleMenuCommandHandler().isAutocompleteHandler()).toBe(
            false,
        );
        expect(new ModuleMenuCommandHandler().isButtonHandler()).toBe(false);
        expect(new ModuleMenuCommandHandler().isCommandHandler()).toBe(false);
        expect(new ModuleMenuCommandHandler().isModalSubmitHandler()).toBe(
            false,
        );
        expect(new ModuleMenuCommandHandler().isSelectMenuHandler()).toBe(
            false,
        );
        expect(new ModuleMenuCommandHandler().isMessageCommandHandler()).toBe(
            false,
        );
    });
    describe('setData method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleMenuCommandHandler.prototype.setData).toEqual(
                'function',
            );
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleMenuCommandHandler();
            expect(
                instance.setData(
                    new ContextMenuCommandBuilder().setName('test'),
                ),
            ).toEqual(instance);
        });
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(
                typeof ModuleMenuCommandHandler.prototype.setExecute,
            ).toEqual('function');
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleMenuCommandHandler();
            expect(
                instance.setExecute((interaction): void => {
                    interaction;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleMenuCommandHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if data is a ContextMenuCommandBuilder and execute is a function', (): void => {
            const instance = new ModuleMenuCommandHandler();
            instance.setData(new ContextMenuCommandBuilder().setName('test'));
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toEqual(true);
        });
        test('returns false if data is not a ContextMenuCommandBuilder or is not set', (): void => {
            const instance = new ModuleMenuCommandHandler();
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toEqual(false);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleMenuCommandHandler();
            instance.setData(new ContextMenuCommandBuilder().setName('test'));
            expect(instance.validate()).toEqual(false);
        });
        test('returns false if data is not a ContextMenuCommandBuilder and execute is not a function', (): void => {
            const instance = new ModuleMenuCommandHandler();
            expect(instance.validate()).toEqual(false);
        });
    });
});
