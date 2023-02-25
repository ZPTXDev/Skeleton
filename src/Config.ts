import { get, set } from 'lodash-es';
import terminalKitPackage from 'terminal-kit';
import type { ConfigItem } from './ConfigItem.js';
const { terminal } = terminalKitPackage;

export class Config {
    private config: ConfigItem[];

    /**
     * Creates an instance of Config.
     * @example
     * new Config([
     *     new StringConfigItem('token', 'Token', 'The bot token', { required: true }),
     * ]);
     * @param data - The data to initialize the config with
     */
    constructor(data?: ConfigItem[]) {
        this.config = data ?? [];
        this.config.forEach((item): void => item.setParentConfig(this));
    }

    /**
     * The data of the config in object form (omits undefined values)
     */
    get data(): Record<string, unknown> {
        const data = {};
        this.config.forEach((item): void => {
            if (item.value !== undefined) set(data, item.path, item.value);
        });
        return data;
    }

    /**
     * Gets a config item value by path
     * @example
     * config.get('features.web.enabled'); // Returns the config item value for the web feature
     * @param path - The path of the config item
     * @returns The config item value
     */
    get(path: string): unknown {
        const item = this.config.find(
            (configItem): boolean => configItem.path === path,
        );
        return item?.value;
    }

    /**
     * Sets (or updates) a config item
     * @example
     * config.set(
     *     new BooleanConfigItem(
     *         'features.web.enabled',
     *         'Web Feature',
     *         'Whether or not the web feature is enabled',
     *         { required: true },
     *     ),
     * );
     * @param configItem - The config item to set / update
     */
    set(configItem: ConfigItem): void {
        const index = this.config.findIndex(
            (item): boolean => item.path === configItem.path,
        );
        if (index === -1) this.config.push(configItem);
        else this.config[index] = configItem;
        this.config.forEach((item): void => item.setParentConfig(this));
    }

    /**
     * Parses an existing JSON config, updating config item values in the process
     * @example
     * config.parseJSON({
     *     token: 'bot-token',
     * });
     * @param data - The JSON config data
     */
    parseJSON(data: Record<string, unknown>): void {
        this.config.forEach((item): void => {
            if (get(data, item.path) !== undefined) {
                item.value = get(data, item.path);
            }
        });
    }

    /**
     * Validates the config
     * @example
     * config.validate(); // Returns whether or not the config is valid
     * @param requiredOnly - Whether or not to only validate required config items
     * @returns Whether or not the config is valid
     */
    validate(requiredOnly?: boolean): boolean {
        return this.config.every((item): boolean =>
            requiredOnly
                ? !item.isRequired() || item.value !== undefined
                : item.value !== undefined,
        );
    }

    /**
     * Sets up the config by asking the user for input (triggers setup for each config item)
     * @example
     * await config.setup();
     * @param requiredOnly - Whether or not to only set up required config items
     */
    async setup(requiredOnly?: boolean): Promise<void> {
        if (this.validate(requiredOnly)) return;
        for (const item of this.config) {
            if (requiredOnly && !item.isRequired()) continue;
            await item.setup();
        }
        terminal('\n');
    }
}
