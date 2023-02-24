import { Comparison } from './Comparison.js';
import type { Config } from './Config.js';

export class ConfigItemRequireCondition {
    config: Config;
    path: string;
    comparison: Comparison;
    value: unknown;

    /**
     * Creates an instance of ConfigItemRequireCondition.
     * @example
     * // The following example will make the config item required if the config item at path.to.config.item is equal to 1
     * new ConfigItemRequireCondition('path.to.config.item', Comparison.Equal, 1);
     * @param path - The path of the config item to check
     * @param comparison - The comparison to use
     * @param value - The value to compare to
     */
    constructor(path: string, comparison: Comparison, value: unknown) {
        this.path = path;
        this.comparison = comparison;
        this.value = value;
    }

    /**
     * Sets the parent config of the condition (usually automatically triggered)
     * @param config - The parent config
     */
    setParentConfig(config: Config): void {
        this.config = config;
    }

    /**
     * Checks whether or not the condition is met
     * @returns Whether or not the condition is met
     */
    check(): boolean {
        switch (this.comparison) {
            case Comparison.Equal:
                return this.config.get(this.path) === this.value;
            case Comparison.NotEqual:
                return this.config.get(this.path) !== this.value;
            default:
                return false;
        }
    }
}
