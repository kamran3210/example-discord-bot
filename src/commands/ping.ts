import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from 'src/typings';

const PingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!');
    },
};

export default PingCommand;