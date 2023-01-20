import { createInterface } from 'readline/promises';
import {
    ExpectedConfigItem,
    ExpectedConfigItemTypes,
} from '../ExpectedConfigItem.js';
import { ZPTXClient } from '../ZPTXClient.js';

jest.mock('readline/promises');
const mockedCreateInterface = <jest.Mock<typeof createInterface>>(
    (createInterface as unknown)
);
describe('ZPTXClient class', (): void => {
    let client: ZPTXClient;
    beforeEach((): void => {
        const expectedConfig = [
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
            new ExpectedConfigItem(
                'prefix',
                ExpectedConfigItemTypes.String,
                'Prefix',
                'The bot prefix',
            ),
            new ExpectedConfigItem(
                'cooldown',
                ExpectedConfigItemTypes.Number,
                'Cooldown',
                'The bot cooldown',
            ),
            new ExpectedConfigItem(
                'debug',
                ExpectedConfigItemTypes.Boolean,
                'Debug',
                'Debug mode',
            ),
        ];
        client = new ZPTXClient({ intents: [] }, {}, expectedConfig);
    });

    it('should have a hookHandlers property', (): void => {
        expect(client).toHaveProperty('hookHandlers');
    });

    it('should have a hookHandlers.commands property', (): void => {
        expect(client['hookHandlers']).toHaveProperty('commands');
    });

    it('should have a hookHandlers.buttons property', (): void => {
        expect(client['hookHandlers']).toHaveProperty('buttons');
    });

    it('should have a hookHandlers.selectMenus property', (): void => {
        expect(client['hookHandlers']).toHaveProperty('selectMenus');
    });

    it('should have a hookHandlers.modals property', (): void => {
        expect(client['hookHandlers']).toHaveProperty('modals');
    });

    it('should have a hookHandlers.events property', (): void => {
        expect(client['hookHandlers']).toHaveProperty('events');
    });

    it('should have a config property', (): void => {
        expect(client).toHaveProperty('config');
    });

    it('should return the correct config when validateConfig is called', (): void => {
        client['config'] = {
            token: '1234',
            prefix: '!',
            cooldown: 1,
            debug: true,
        };
        expect(client['validateConfig']()).toBe(true);
    });

    it('should return the same config when setupConfig is called with no missing properties', async (): Promise<void> => {
        client['config'] = {
            token: '1234',
            prefix: '!',
            cooldown: 1,
            debug: true,
        };
        mockedCreateInterface.mockReturnValue({
            question: jest.fn(),
            close: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        const updatedConfig = await client.setupConfig();
        expect(updatedConfig).toEqual({
            token: '1234',
            prefix: '!',
            cooldown: 1,
            debug: true,
        });
    });

    it('should return the updated config when setupConfig is called', async (): Promise<void> => {
        client['config'] = {};
        mockedCreateInterface.mockReturnValue({
            question: jest
                .fn()
                .mockResolvedValueOnce('1234')
                .mockResolvedValueOnce('!')
                .mockResolvedValueOnce('1')
                .mockResolvedValueOnce('true'),
            close: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        const updatedConfig = await client.setupConfig();
        expect(updatedConfig).toEqual({
            token: '1234',
            prefix: '!',
            cooldown: 1,
            debug: true,
        });
    });
});
