import { GatewayIntentBits } from 'discord.js';
import { SkeletonClient } from '../SkeletonClient.js';

describe('SkeletonClient class', (): void => {
    let client: SkeletonClient;
    beforeEach((): void => {
        client = new SkeletonClient({ intents: [GatewayIntentBits.Guilds] });
    });

    it('should pass discord.js ClientOptions', (): void => {
        expect(client.options.intents.equals(GatewayIntentBits.Guilds)).toBe(
            true,
        );
    });

    it('should have handlers for all interaction types', (): void => {
        expect(client['interactionHandlers'].autocomplete).toBeDefined();
        expect(client['interactionHandlers'].button).toBeDefined();
        expect(client['interactionHandlers'].command).toBeDefined();
        expect(client['interactionHandlers'].modalSubmit).toBeDefined();
        expect(client['interactionHandlers'].selectMenu).toBeDefined();
    });

    it('should have unique handlers for each interaction name', (): void => {
        const autocompleteHandler = jest.fn();
        const buttonHandler = jest.fn();
        const commandHandler = jest.fn();
        const modalSubmitHandler = jest.fn();
        const selectMenuHandler = jest.fn();

        client['interactionHandlers'].autocomplete.set(
            'autocomplete1',
            autocompleteHandler,
        );
        client['interactionHandlers'].button.set('button1', buttonHandler);
        client['interactionHandlers'].command.set('command1', commandHandler);
        client['interactionHandlers'].modalSubmit.set(
            'modalSubmit1',
            modalSubmitHandler,
        );
        client['interactionHandlers'].selectMenu.set(
            'selectMenu1',
            selectMenuHandler,
        );

        expect(client['interactionHandlers'].autocomplete.size).toBe(1);
        expect(client['interactionHandlers'].button.size).toBe(1);
        expect(client['interactionHandlers'].command.size).toBe(1);
        expect(client['interactionHandlers'].modalSubmit.size).toBe(1);
        expect(client['interactionHandlers'].selectMenu.size).toBe(1);

        client['interactionHandlers'].autocomplete.set(
            'autocomplete2',
            autocompleteHandler,
        );
        client['interactionHandlers'].button.set('button2', buttonHandler);
        client['interactionHandlers'].command.set('command2', commandHandler);
        client['interactionHandlers'].modalSubmit.set(
            'modalSubmit2',
            modalSubmitHandler,
        );
        client['interactionHandlers'].selectMenu.set(
            'selectMenu2',
            selectMenuHandler,
        );

        expect(client['interactionHandlers'].autocomplete.size).toBe(2);
        expect(client['interactionHandlers'].button.size).toBe(2);
        expect(client['interactionHandlers'].command.size).toBe(2);
        expect(client['interactionHandlers'].modalSubmit.size).toBe(2);
        expect(client['interactionHandlers'].selectMenu.size).toBe(2);
    });

    it('should have a eventHandlers property', (): void => {
        expect(client).toHaveProperty('eventHandlers');
    });
});
