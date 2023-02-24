import { Config } from '../Config.js';
import { ZPTXClient } from '../ZPTXClient.js';

describe('ZPTXClient class', (): void => {
    let client: ZPTXClient;
    beforeEach((): void => {
        client = new ZPTXClient({ intents: [] }, new Config());
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
});
