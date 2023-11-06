import type { Collection, Message } from 'discord.js';
import type { LoggerObject } from '../Logger.js';
import type { ModuleMessageCommandHandler } from '../ModuleHandlers/index.js';

type MessageHandlerOptions = {
    /** The message to handle */
    message: Message;
    /** The accepted prefix(es) */
    prefix: string[];
    /** Collection containing message command handlers */
    messageCommandHandlers: Collection<string, ModuleMessageCommandHandler>;
    /** Internal logger object */
    logger: LoggerObject;
};

/**
 * Internal messageCreate event handler
 */
export async function MessageHandler({
    message,
    prefix,
    messageCommandHandlers,
    logger,
}: MessageHandlerOptions): Promise<void> {
    const triggeredPrefix = prefix.find((p): boolean =>
        message.content.startsWith(p),
    );
    if (!triggeredPrefix) return;
    const source = `from UID ${message.author.id}${
        message.inGuild() ? ` in GID ${message.guildId}` : ''
    }`;
    const details = `MessageCommand ${message.content}`;
    logger.info(`Received ${details} ${source}`);
    const command = message.content
        .substring(triggeredPrefix.length)
        .split(' ')[0];
    const { execute } = messageCommandHandlers.get(command);
    if (execute) {
        logger.verbose(`Matched message command handler ${command}`);
        logger.verbose(`Responding to ${details} ${source}`);
        await execute(message);
        return;
    }
    logger.warn(`Ignoring ${details} ${source}`);
}
