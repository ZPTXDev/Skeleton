import { getAbsoluteFileURL } from '@zptxdev/zptx-lib';
import { readdirSync } from 'fs';
import { Language } from './Language.js';

export class LanguageManager {
    private languages: Record<string, Language> = {};

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
            this.languages[folder] = new Language(folder, strings);
        }
    }

    get(locale: string): Language {
        return this.languages[locale];
    }

    getLanguages(): string[] {
        return Object.keys(this.languages);
    }
}
