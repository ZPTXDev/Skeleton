import {
    ExpectedConfigItem,
    ExpectedConfigItemTypes,
} from '../ExpectedConfigItem.js';

describe('ExpectedConfigItem class', (): void => {
    it('should have a path property', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
        ).toHaveProperty('path');
    });

    it('should have a type property', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
        ).toHaveProperty('type');
    });

    it('should have a label property', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
        ).toHaveProperty('label');
    });

    it('should have a description property', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
        ).toHaveProperty('description');
    });

    it('should have a title property', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
        ).toHaveProperty('title');
    });

    it('should have a question property', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ),
        ).toHaveProperty('question');
    });

    it('should have a title property that returns the label and description', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ).title,
        ).toBe('Token - The bot token');
    });

    it('should have a question property that returns the question for a string', (): void => {
        expect(
            new ExpectedConfigItem(
                'token',
                ExpectedConfigItemTypes.String,
                'Token',
                'The bot token',
            ).question,
        ).toBe('Enter a value of type string: ');
    });

    it('should have a question property that returns the question for a number', (): void => {
        expect(
            new ExpectedConfigItem(
                'cooldown',
                ExpectedConfigItemTypes.Number,
                'Cooldown',
                'The bot cooldown',
            ).question,
        ).toBe('Enter a value of type number: ');
    });

    it('should have a question property that returns the question for a boolean', (): void => {
        expect(
            new ExpectedConfigItem(
                'debug',
                ExpectedConfigItemTypes.Boolean,
                'Debug',
                'The bot debug mode',
            ).question,
        ).toBe('Enter a value of type boolean (true/false): ');
    });
});
