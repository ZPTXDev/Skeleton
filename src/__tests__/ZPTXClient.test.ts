import { createInterface } from 'readline/promises';
import ZPTXClient from '../ZPTXClient.js';

jest.mock('readline/promises');
const mockedCreateInterface = <jest.Mock<typeof createInterface>>(
    (createInterface as unknown)
);
describe('ZPTXClient class', (): void => {
    let client: ZPTXClient;
    beforeEach((): void => {
        client = new ZPTXClient({ intents: [] }, {});
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
        const expectedConfig = [
            {
                path: 'token',
                type: 'string',
                label: 'Token',
                description: 'The bot token',
            },
            {
                path: 'prefix',
                type: 'string',
                label: 'Prefix',
                description: 'The bot prefix',
            },
        ];
        client['config'] = { token: '1234', prefix: '!' };
        expect(client['validateConfig'](expectedConfig)).toBe(true);
    });

    it('should return the updated config when setupConfig is called', async (): Promise<void> => {
        const expectedConfig = [
            {
                path: 'token',
                type: 'string',
                label: 'Token',
                description: 'The bot token',
            },
            {
                path: 'prefix',
                type: 'string',
                label: 'Prefix',
                description: 'The bot prefix',
            },
        ];
        client['config'] = {};
        mockedCreateInterface.mockReturnValue({
            question: jest
                .fn()
                .mockResolvedValueOnce('1234')
                .mockResolvedValueOnce('!'),
            close: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        const updatedConfig = await client.setupConfig(expectedConfig);
        expect(updatedConfig).toEqual({ token: '1234', prefix: '!' });
    });
});
