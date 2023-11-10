import type { ClientEvents } from 'discord.js';
import {
    ModuleBaseHandler,
    type GenericExecuteFunction,
} from './ModuleBaseHandler.js';

type GenericEventExecuteFunction<K extends keyof ClientEvents> = (
    ...args: ClientEvents[K]
) => Promise<void> | void;

export type AcceptedEventTypes = keyof ClientEvents | string | symbol;

export class ModuleEventHandler<
    E extends AcceptedEventTypes,
> extends ModuleBaseHandler {
    once = false;
    execute: GenericEventExecuteFunction<keyof ClientEvents>;

    /**
     * Set whether this event handler should only be called once.
     * @param once - Whether this event handler should only be called once.
     * @returns This instance for chaining.
     */
    setOnce(once: boolean): this {
        this.once = once;
        return this;
    }

    /**
     * Sets the event for this handler.
     * @param _event - The event.
     * @returns This instance for chaining.
     */
    setEvent<K extends keyof ClientEvents>(_event: K): ModuleEventHandler<K> {
        const newInstance = new ModuleEventHandler<K>();
        newInstance.once = this.once;
        newInstance.execute = this.execute;
        return newInstance;
    }

    setExecute(
        execute: E extends keyof ClientEvents
            ? GenericEventExecuteFunction<E>
            : GenericExecuteFunction,
    ): this {
        this.execute = execute;
        return this;
    }

    validate(): boolean {
        return (
            typeof this.once === 'boolean' && typeof this.execute === 'function'
        );
    }
}
