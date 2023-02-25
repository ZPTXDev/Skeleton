import { BooleanConfigItem } from '../BooleanConfigItem.js';
import { Config } from '../Config.js';
import { StringConfigItem } from '../StringConfigItem.js';

describe('Config class', (): void => {
    let config: Config;

    beforeEach((): void => {
        config = new Config([
            new BooleanConfigItem(
                'features.web.enabled',
                'Web Feature',
                'Whether or not the web feature is enabled',
            ),
            new StringConfigItem('token', 'Token', 'The bot token', {
                required: true,
            }),
        ]);
    });

    it('should initialize with provided data', (): void => {
        const data = {
            features: { web: { enabled: true } },
            token: 'secret-token',
        };
        config.parseJSON(data);
        expect(config.data).toEqual(data);
        expect(config.get('features.web.enabled')).toBe(true);
        expect(config.get('token')).toBe('secret-token');
    });

    it('should return the value of a config item by path, and set a config item', (): void => {
        const configItem = new BooleanConfigItem(
            'features.web.enabled',
            'Web Feature',
            'Whether or not the web feature is enabled',
            { required: true },
        );
        expect(config.get('features.web.enabled')).toBeUndefined();
        config.set(configItem);
        expect(config.get('features.web.enabled')).toBeUndefined();
        configItem.value = true;
        config.set(configItem);
        expect(config.get('features.web.enabled')).toBe(true);
    });

    it('should parse a JSON config', (): void => {
        const data = {
            features: { web: { enabled: true } },
            token: 'secret-token',
        };
        config.parseJSON(data);
        expect(config.get('features.web.enabled')).toBe(true);
        expect(config.get('token')).toBe('secret-token');
    });

    it('should validate the config', (): void => {
        expect(config.validate()).toBe(false);
        expect(config.validate(true)).toBe(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any = {
            token: 'secret-token',
        };
        config.parseJSON(data);
        expect(config.validate()).toBe(false);
        expect(config.validate(true)).toBe(true);
        data = {
            features: { web: { enabled: true } },
            token: 'secret-token',
        };
        config.parseJSON(data);
        expect(config.validate()).toBe(true);
        expect(config.validate(true)).toBe(true);
    });
});
