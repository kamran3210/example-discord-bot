import path from "path";
import fs from "fs";
import { Command } from "./typings";

export default class CommandLoader {
    private m_commands: Command[];
    private loading = false;

    public async getCommands(): Promise<Command[]> {
        if (this.loading) {
            console.error('Currently loading commands');
            return;
        }
        if (!Array.isArray(this.m_commands)) {
            try {
                this.loading = true;
                await this.loadCommands();
            } catch (e) {
                console.error('Error trying to load commands', e);
            } finally {
                this.loading = false;
            }
        }
        return this.m_commands;
    }

    private async loadCommands(): Promise<Command[]> {
        this.loading = true;
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file =>
            process.env.DEV_MODE ? file.endsWith('.ts') : file.endsWith('.js')
        );

        this.m_commands = [];
        const promises = commandFiles.map((f) => this.loadCommand(path.join(commandsPath, f)));
        await Promise.all(promises);

        this.loading = false;
        return this.m_commands;
    }

    private async loadCommand(filePath: string) {
        const { default: command } = await import(filePath);
        this.m_commands.push(command as Command);
        console.log(`Loading ${command.data.name} command`);
    }
}