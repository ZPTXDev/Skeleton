import { SlashCommandBuilder } from 'discord.js';
import { ModuleCommandHandler } from '../ModuleCommandHandler.js';

describe('ModuleCommandHandler class', (): void => {
    test('is a class', (): void => {
        expect(typeof ModuleCommandHandler).toEqual('function');
        expect(ModuleCommandHandler.prototype.constructor.name).toEqual(
            'ModuleCommandHandler',
        );
    });
    test('can be instantiated', (): void => {
        expect((): void => {
            new ModuleCommandHandler();
        }).not.toThrow();
    });
    test('appropriate typecheck method returns true', (): void => {
        expect(new ModuleCommandHandler().isCommandHandler()).toBe(true);
    });
    test('all other typecheck methods return false', (): void => {
        expect(new ModuleCommandHandler().isEventHandler()).toBe(false);
        expect(new ModuleCommandHandler().isAutocompleteHandler()).toBe(false);
        expect(new ModuleCommandHandler().isButtonHandler()).toBe(false);
        expect(new ModuleCommandHandler().isMenuCommandHandler()).toBe(false);
        expect(new ModuleCommandHandler().isModalSubmitHandler()).toBe(false);
        expect(new ModuleCommandHandler().isSelectMenuHandler()).toBe(false);
        expect(new ModuleCommandHandler().isMessageCommandHandler()).toBe(
            false,
        );
    });
    describe('setData method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleCommandHandler.prototype.setData).toEqual(
                'function',
            );
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleCommandHandler();
            expect(
                instance.setData(
                    new SlashCommandBuilder()
                        .setName('test')
                        .setDescription('test'),
                ),
            ).toEqual(instance);
        });
    });
    describe('setExecute method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleCommandHandler.prototype.setExecute).toEqual(
                'function',
            );
        });
        test('returns itself (for chaining)', (): void => {
            const instance = new ModuleCommandHandler();
            expect(
                instance.setExecute((interaction): void => {
                    interaction;
                }),
            ).toEqual(instance);
        });
    });
    describe('validate method', (): void => {
        test('is a function', (): void => {
            expect(typeof ModuleCommandHandler.prototype.validate).toEqual(
                'function',
            );
        });
        test('returns true if data is a SlashCommandBuilder and execute is a function', (): void => {
            const instance = new ModuleCommandHandler();
            instance.setData(
                new SlashCommandBuilder()
                    .setName('test')
                    .setDescription('test'),
            );
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toEqual(true);
        });
        test('returns false if data is not a SlashCommandBuilder or is not set', (): void => {
            const instance = new ModuleCommandHandler();
            instance.setExecute((interaction): void => {
                interaction;
            });
            expect(instance.validate()).toEqual(false);
        });
        test('returns false if execute is not a function or is not set', (): void => {
            const instance = new ModuleCommandHandler();
            instance.setData(
                new SlashCommandBuilder()
                    .setName('test')
                    .setDescription('test'),
            );
            expect(instance.validate()).toEqual(false);
        });
        test('returns false if data is not a SlashCommandBuilder and execute is not a function', (): void => {
            const instance = new ModuleCommandHandler();
            expect(instance.validate()).toEqual(false);
        });
    });
});
