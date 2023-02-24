import terminalKitPackage from 'terminal-kit';
import type { ConfigItemOptions } from './ConfigItem.js';
import { ConfigItem } from './ConfigItem.js';
const { terminal } = terminalKitPackage;

type NumberConfigItemOptions = ConfigItemOptions & {
    defaultValue?: number;
    min?: number;
    max?: number;
};

export class NumberConfigItem extends ConfigItem {
    declare value: number;
    declare defaultValue: number;
    min: number;
    max: number;

    /**
     * Creates an instance of NumberConfigItem.
     * @example
     * new NumberConfigItem('commandCooldown', 'Command Cooldown', 'The cooldown between commands.', { required: true, min: 5, max: 10 });
     * @example
     * new NumberConfigItem('commandCooldown', 'Command Cooldown', 'The cooldown between commands.', { defaultValue: 5, min: 5, max: 10 });
     * @param path - The path to the config item in the config object
     * @param label - The label of the config item
     * @param description - The description of the config item
     * @param options - The options of the config item
     */
    constructor(
        path: string,
        label: string,
        description: string,
        options?: NumberConfigItemOptions,
    ) {
        super(path, label, description, options);
        this.min = options?.min;
        this.max = options?.max;
    }

    /**
     * Set up the config item by asking the user for input
     * @param override - Whether or not to override the current value if it exists
     * @returns The value of the updated config item
     */
    async setup(override?: boolean): Promise<number> {
        if (!override && this.value !== undefined) return this.value;
        this.printSetupHeader();
        terminal(
            `\nEnter a number${
                this.min && !this.max
                    ? ` from ${this.min}`
                    : !this.min && this.max
                    ? ` less than or equal to ${this.max}`
                    : this.min && this.max
                    ? ` between ${this.min} and ${this.max}`
                    : ''
            }: `,
        );
        this.value = Number(
            await terminal.inputField({
                default: this.defaultValue?.toString() ?? '',
            }).promise,
        );
        while (
            isNaN(this.value) ||
            this.value < this.min ||
            this.value > this.max
        ) {
            terminal.red('\nInvalid number! Please try again.');
            terminal(
                `\nEnter a number${
                    this.min && !this.max
                        ? ` from ${this.min}`
                        : !this.min && this.max
                        ? ` less than or equal to ${this.max}`
                        : this.min && this.max
                        ? ` between ${this.min} and ${this.max}`
                        : ''
                }: `,
            );
            this.value = Number(
                await terminal.inputField({
                    default: this.defaultValue?.toString() ?? '',
                    minLength: this.isRequired() ? 1 : 0,
                }).promise,
            );
        }
        terminal('\n');
        this.config.set(this);
        return this.value;
    }
}
