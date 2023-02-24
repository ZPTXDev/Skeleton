import terminalKitPackage from 'terminal-kit';
import type { Config } from './Config.js';
import type { ConfigItemRequireCondition } from './ConfigItemRequireCondition.js';
const { terminal } = terminalKitPackage;

export type ConfigItemOptions = {
    required?: boolean | ConfigItemRequireCondition[];
    defaultValue?: unknown;
};

export abstract class ConfigItem {
    config: Config;
    path: string;
    label: string;
    description: string;
    value: unknown;
    required: boolean | ConfigItemRequireCondition[];
    defaultValue: unknown;

    /**
     * Creates an instance of ConfigItem. (This is an abstract class and cannot be instantiated directly)
     * @param path - The path to the config item in the config object
     * @param label - The label of the config item
     * @param description - The description of the config item
     * @param options - The options of the config item
     */
    constructor(
        path: string,
        label: string,
        description: string,
        options?: ConfigItemOptions,
    ) {
        this.path = path;
        this.label = label;
        this.description = description;
        this.required = options?.required ?? false;
        this.defaultValue = options?.defaultValue;
    }

    /**
     * Sets the parent config of the config item (usually automatically triggered; also triggers setParentConfig on all required conditions, if any)
     * @param config - The parent config
     */
    setParentConfig(config: Config): void {
        this.config = config;
        if (Array.isArray(this.required)) {
            this.required.forEach((condition): void => {
                condition.setParentConfig(config);
            });
        }
    }

    /**
     * Checks whether or not the config item is required (if required is a boolean, returns that boolean; if required is an array, returns whether or not all conditions are met)
     * @returns Whether or not the config item is required
     */
    isRequired(): boolean {
        if (this.required === true) {
            return true;
        }
        if (Array.isArray(this.required)) {
            return this.required.every((condition): boolean =>
                condition.check(),
            );
        }
        return false;
    }

    /**
     * Prints the setup header (for internal use)
     */
    protected printSetupHeader(): void {
        terminal('\n');
        terminal.bgGray().black().bold(` ${this.label} `);
        terminal.styleReset(
            ` ${this.description}${this.isRequired() ? ' ^r(required)' : ''}`,
        );
    }

    abstract setup(): Promise<unknown>;
}
