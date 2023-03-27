import { get } from 'lodash-es';
const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language',
});

export class Language {
    locale: string;
    name: string;
    private strings: Record<string, unknown> = {};

    /**
     * Creates an instance of Language.
     * @param locale - The locale of the language
     * @param strings - The strings of the language
     */
    constructor(locale: string, strings: Record<string, unknown>) {
        this.locale = locale;
        this.name = languageNames.of(locale);
        this.strings = strings;
    }

    /**
     * Gets a string by path
     * @param path - The path of the string
     * @returns The string
     * @example
     * language.get('DISCORD.CONNECTION_ERROR'); // Returns the string a Discord connection error
     */
    get(path: string): unknown {
        return get(this.strings, path);
    }
}
