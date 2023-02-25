import terminalKitPackage from 'terminal-kit';
import type { ConfigItemOptions } from './ConfigItem.js';
import { ConfigItem } from './ConfigItem.js';
const { terminal } = terminalKitPackage;

type BooleanConfigItemOptions = ConfigItemOptions & {
    defaultValue?: boolean;
};

export class BooleanConfigItem extends ConfigItem {
    declare value: boolean;
    declare defaultValue: boolean;

    /**
     * Creates an instance of BooleanConfigItem.
     * @example
     * new BooleanConfigItem('features.web.enabled', 'Web Feature', 'Whether or not the web feature is enabled', { required: true });
     * @param path - The path to the config item in the config object
     * @param label - The label of the config item
     * @param description - The description of the config item
     * @param options - The options of the config item (note: defaultValue does not apply to BooleanConfigItem)
     */
    constructor(
        path: string,
        label: string,
        description: string,
        options?: BooleanConfigItemOptions,
    ) {
        super(path, label, description, options);
    }

    /**
     * Set up the config item by asking the user for input
     * @param override - Whether or not to override the current value if it exists
     * @returns The value of the updated config item
     */
    async setup(override?: boolean): Promise<boolean> {
        if (!override && this.value !== undefined) return this.value;
        this.printSetupHeader();
        const response = await terminal.gridMenu(['Yes', 'No']).promise;
        this.value = response.selectedText === 'Yes';
        this.config.set(this);
        return this.value;
    }
}
