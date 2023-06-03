# example-discord-bot
Example discord bot using discord.js and Typescript to get started

Has an example `/ping` command and an event lister for this command to get you started.

Uses node v18.16.0

# Instructions
Clone repository and rename `.env.example` to `.env`.
Replace `YOUR-DISCORD-BOT-TOKEN-HERE` in `.env.` with your bot token.

`npm run commands -- --global` to register commands globally.
`npm run commands -- <guild_id>` to register commands for a specific guild.

`npm run start` to start the bot.
`npm run start:dev` to start the bot in dev mode (cold reloads on saves).
