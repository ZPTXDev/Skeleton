export enum ExpectedConfigItemTypes {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
}

export class ExpectedConfigItem {
    path: string;
    type: ExpectedConfigItemTypes;
    label: string;
    description: string;

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

    get title(): string {
        return `${this.label} - ${this.description}`;
    }

    get question(): string {
        return `Enter a value of type ${this.type}${
            this.type === ExpectedConfigItemTypes.Boolean ? ' (true/false)' : ''
        }: `;
    }
}
