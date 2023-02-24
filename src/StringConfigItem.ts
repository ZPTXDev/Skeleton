import terminalKitPackage from 'terminal-kit';
import type { ConfigItemOptions } from './ConfigItem.js';
import { ConfigItem } from './ConfigItem.js';
const { terminal } = terminalKitPackage;

type StringConfigItemOptions = ConfigItemOptions & {
    defaultValue?: string;
    allowedValues?: string[];
};

export class StringConfigItem extends ConfigItem {
    declare value: string;
    declare defaultValue: string;
    allowedValues: string[];

    /**
     * Creates an instance of StringConfigItem.
     * @example
     * new StringConfigItem('token', 'Color', 'The main color to be used by the bot.', { required: true });
     * @example
     * new StringConfigItem('color', 'Color', 'The main color to be used by the bot.', { allowedValues: ['red', 'green', 'blue'] });
     * @example
     * new StringConfigItem('color', 'Color', 'The main color to be used by the bot.', { defaultValue: 'red' });
     * @param path - The path to the config item in the config object
     * @param label - The label of the config item
     * @param description - The description of the config item
     * @param options - The options of the config item
     */
    constructor(
        path: string,
        label: string,
        description: string,
        options?: StringConfigItemOptions,
    ) {
        super(path, label, description, options);
        this.allowedValues = options?.allowedValues ?? [];
    }

    /**
     * Set up the config item by asking the user for input
     * @param override - Whether or not to override the current value if it exists
     * @returns The value of the updated config item
     */
    async setup(override?: boolean): Promise<string> {
        if (!override && this.value !== undefined) return this.value;
        this.printSetupHeader();
        if (this.allowedValues.length > 0) {
            const response = await terminal.gridMenu(this.allowedValues)
                .promise;
            this.value = response.selectedText;
        } else {
            terminal('\nEnter value: ');
            this.value = await terminal.inputField({
                default: this.defaultValue ?? '',
                minLength: this.isRequired() ? 1 : 0,
            }).promise;
            terminal('\n');
        }
        this.config.set(this);
        return this.value;
    }
}
