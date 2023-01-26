export enum ExpectedConfigItemTypes {
    /**
     * A string
     */
    String = 'string',
    /**
     * A number (e.g. 1, 0.5, 0.25)
     */
    Number = 'number',
    /**
     * A boolean (true or false)
     */
    Boolean = 'boolean',
}

export class ExpectedConfigItem {
    path: string;
    type: ExpectedConfigItemTypes;
    label: string;
    description: string;

    /**
     * Creates an instance of ExpectedConfigItem.
     * @example
     * new ExpectedConfigItem('token', ExpectedConfigItemTypes.String, 'Token', 'The bot token');
     * @example
     * new ExpectedConfigItem(
     *     'features.web.enabled',
     *     ExpectedConfigItemTypes.Boolean,
     *     'Web Feature',
     *     'Whether or not the web feature is enabled',
     * );
     * @param path - The path to the config item in the config object
     * @param type - The type of the config item
     * @param label - The label of the config item
     * @param description - The description of the config item
     */
    constructor(
        path: string,
        type: ExpectedConfigItemTypes,
        label: string,
        description: string,
    ) {
        this.path = path;
        this.type = type;
        this.label = label;
        this.description = description;
    }

    /**
     * The title of the config item, formatted as `label - description`
     */
    get title(): string {
        return `${this.label} - ${this.description}`;
    }

    /**
     * The question to ask the user for the config item
     */
    get question(): string {
        return `Enter a value of type ${this.type}${
            this.type === ExpectedConfigItemTypes.Boolean ? ' (true/false)' : ''
        }: `;
    }
}
