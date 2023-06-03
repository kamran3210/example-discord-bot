import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import CommandLoader from './commandLoader';
import { Command } from './typings';
config({ path: './.env' });

if (!process.env.TOKEN) {
	console.error('Missing client token');
	process.exit(1);
}

const args = process.argv.slice(2);
const clientId = Buffer.from(process.env.TOKEN.split('.')[0], 'base64').toString();
const guildId = args[0] || undefined;
const rest = new REST().setToken(process.env.TOKEN);

let url: `/${string}`;
if (process.argv.includes('--global')) {
	url = Routes.applicationCommands(clientId);
}
else if (guildId?.match(/^[0-9]{17,20}$/)) {
	url = Routes.applicationGuildCommands(clientId, guildId);
}
else {
	console.error('Invalid guild ID specified');
	process.exit(0);
}

(async () => {
	const commandLoader = new CommandLoader();
	let commands: Command[];
	try {
		commands = await commandLoader.getCommands();
	} catch (error) {
		console.error(error);
	}

	try {
		console.log(`Started refreshing commands.`);
		await rest.put(url, { body: commands.map((c) => c.data.toJSON()) });
		console.log(`Successfully reloaded commands.`);
	} catch (error) {
		console.error(error);
	}
})();