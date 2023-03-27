import Keyv from 'keyv';
import { get, set, unset } from 'lodash-es';

/** Class for managing data through Keyv. */
export class DataManager {
    cache: Keyv;

    /**
     * Create an instance of DataManager, also creating a database connection.
     * @param opts - The options to pass to Keyv.
     */
    constructor(opts: { cache: string; namespace: string }) {
        this.cache = new Keyv({
            uri: opts.cache,
            namespace: opts.namespace,
        });
    }

    /**
     * Get an item from the database by its key.
     * @param key - The key.
     * @param item - The item to retrieve.
     * @returns The requested item.
     */
    async get<T>(key: string, item: string): Promise<T | undefined> {
        const data: unknown = await this.cache.get(key);
        if (!data) return undefined;
        return get(data, item);
    }

    /**
     * Set an item in the database by its key.
     * @param key - The key.
     * @param item - The item to set.
     * @param value - The value to set.
     * @returns The updated item.
     */
    async set(
        key: string,
        item: string,
        value: string | number | boolean,
    ): Promise<true> {
        let data: unknown = await this.cache.get(key);
        if (!data) data = {};
        return this.cache.set(
            key,
            set(data as Record<string, unknown>, item, value),
        );
    }

    /**
     * Unset an item in the database by its key.
     * @param key - The key.
     * @param item - The item to unset.
     * @returns The updated item.
     */
    async unset(key: string, item: string): Promise<boolean> {
        const data: unknown = await this.cache.get(key);
        if (!data) return false;
        unset(data, item);
        return this.cache.set(key, data);
    }

    /**
     * Get the Keyv instance used by this DataManager.
     * @returns The Keyv instance.
     */
    get instance(): Keyv {
        return this.cache;
    }
}
