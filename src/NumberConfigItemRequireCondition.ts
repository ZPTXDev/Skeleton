import { Comparison } from './Comparison.js';
import { ConfigItemRequireCondition } from './ConfigItemRequireCondition.js';

export class NumberConfigItemRequireCondition extends ConfigItemRequireCondition {
    /**
     * Creates an instance of NumberConfigItemRequireCondition.
     * @example
     * // The following example will make the config item required if the config item at path.to.config.item is more than 1
     * new NumberConfigItemRequireCondition('path.to.config.item', Comparison.GreaterThan, 1);
     * @param path - The path of the config item to check
     * @param comparison - The comparison to use
     * @param value - The value to compare to
     */
    constructor(path: string, comparison: Comparison, value: number) {
        super(path, comparison, value);
    }

    /**
     * Checks whether or not the condition is met
     * @returns Whether or not the condition is met
     */
    override check(): boolean {
        switch (this.comparison) {
            case Comparison.GreaterThan:
                return this.config.get(this.path) > this.value;
            case Comparison.LessThan:
                return this.config.get(this.path) < this.value;
            case Comparison.GreaterThanOrEqual:
                return this.config.get(this.path) >= this.value;
            case Comparison.LessThanOrEqual:
                return this.config.get(this.path) <= this.value;
            default:
                return super.check();
        }
    }
}
