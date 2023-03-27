import { getAbsoluteFileURL } from '@zptxdev/zptx-lib';
import { readdirSync } from 'fs';
import { Language } from './Language.js';

export class LanguageManager {
    private _languages: Record<string, Language> = {};

    /**
     * Creates an instance of LanguageManager.
     * @param baseURL - The base URL of the file
     */
    async initialize(baseURL: string): Promise<void> {
        const folders = readdirSync(
            getAbsoluteFileURL(baseURL, ['..', 'locales']),
        );
        for await (const folder of folders) {
            const files = readdirSync(
                getAbsoluteFileURL(baseURL, ['..', 'locales', folder]),
            );
            const strings: Record<string, unknown> = {};
            for await (const file of files) {
                const categoryProps = await import(
                    getAbsoluteFileURL(baseURL, [
                        '..',
                        'locales',
                        folder,
                        file,
                    ]).toString()
                );
                const categoryName = file.split('.')[0].toUpperCase();
                strings[categoryName] = categoryProps.default;
            }
            this._languages[folder] = new Language(folder, strings);
        }
    }

    /**
     * Gets a language by locale
     * @param locale - The locale of the language
     * @returns The language
     */
    get(locale: string): Language {
        return this._languages[locale];
    }

    /**
     * The languages
     */
    get languages(): string[] {
        return Object.keys(this.languages);
    }
}
