import { ClientEvents, Collection } from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
    }
}

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface DiscordEvent {
    name: keyof ClientEvents;
    once?: boolean;
    execute(...args): Promise<void>;
}