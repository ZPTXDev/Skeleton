import type { ColorResolvable } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

export function embed(
    input: string | EmbedBuilder,
    color: ColorResolvable,
): EmbedBuilder {
    if (typeof input === 'string') {
        return new EmbedBuilder().setDescription(input).setColor(color);
    }
    return input.setColor(color);
}
