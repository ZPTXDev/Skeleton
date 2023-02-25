import { BooleanConfigItem } from '../BooleanConfigItem.js';

describe('BooleanConfigItem class', (): void => {
    it('should initialize BooleanConfigItem class correctly', (): void => {
        const booleanConfigItem = new BooleanConfigItem(
            'features.web.enabled',
            'Web Feature',
            'Whether or not the web feature is enabled',
            { required: true },
        );
        expect(booleanConfigItem).toBeInstanceOf(BooleanConfigItem);
        expect(booleanConfigItem.path).toBe('features.web.enabled');
        expect(booleanConfigItem.label).toBe('Web Feature');
        expect(booleanConfigItem.description).toBe(
            'Whether or not the web feature is enabled',
        );
        expect(booleanConfigItem.isRequired()).toEqual(true);
    });

    it('should set the value property of BooleanConfigItem class correctly', (): void => {
        const booleanConfigItem = new BooleanConfigItem(
            'features.web.enabled',
            'Web Feature',
            'Whether or not the web feature is enabled',
            { required: true },
        );
        booleanConfigItem.value = true;
        expect(booleanConfigItem.value).toBe(true);
    });

    it('should set the defaultValue property of BooleanConfigItem class correctly', (): void => {
        const booleanConfigItem = new BooleanConfigItem(
            'features.web.enabled',
            'Web Feature',
            'Whether or not the web feature is enabled',
            { defaultValue: false },
        );
        expect(booleanConfigItem.defaultValue).toBe(false);
    });
});
