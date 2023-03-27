import { get } from 'lodash-es';
const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language',
});

export class Language {
    locale: string;
    name: string;
    private strings: Record<string, unknown> = {};

    constructor(locale: string, strings: Record<string, unknown>) {
        this.locale = locale;
        this.name = languageNames.of(locale);
        this.strings = strings;
    }

    get(path: string): unknown {
        return get(this.strings, path);
    }
}
