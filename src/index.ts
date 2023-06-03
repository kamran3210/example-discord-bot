import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import CommandLoader from './commandLoader';
import EventLoader from './eventLoader';
config({ path: './.env' });

// running npm run start:dev uses ts-node
if (process[Symbol.for("ts-node.register.instance")]) {
    process.env.DEV_MODE = "true";
    console.log('Dev mode');
}

if (!process.env.TOKEN) {
    console.error('Missing client token. Shutting down...');
    process.exit(1);
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
const commandLoader = new CommandLoader();
client.commands = new Collection();
commandLoader.getCommands().then((commands) => {
    commands.forEach((c) => {
        client.commands.set(c.data.name, c);
    });
}).catch((e) => console.log(e));

// Load event listeners
const eventLoader = new EventLoader();
eventLoader.getEvents().then((events) => {
    events.forEach((e) => {
        if (e.once) {
            client.once(e.name, (...args) => e.execute(...args));
        } else {
            client.on(e.name, (...args) => e.execute(...args));
        }
    });
}).catch((e) => console.log(e));

// This catches when the process is about to exit and destroys the discord.js client 
// in order to allow for a graceful shutdown.
process.on('exit', () => {
    console.log('Destroying discord.js Client...');
    client.destroy();
});

// This catches unhandled promise rejections and logs them.
process.on('unhandledRejection', (error) =>
    console.error('Uncaught Promise Rejection', error));

// Log in to Discord with your client's token
client.login(process.env.TOKEN)
    .catch((err) => console.error('Error logging into Discord', err));