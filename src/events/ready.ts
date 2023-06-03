import { Client, Events } from 'discord.js';
import { DiscordEvent } from 'src/typings';

const ReadyEvent: DiscordEvent = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

export default ReadyEvent;