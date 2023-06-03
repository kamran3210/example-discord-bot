import path from "path";
import fs from "fs";
import { DiscordEvent } from "./typings";

export default class EventLoader {
    private m_events: DiscordEvent[];
    private loading = false;

    public async getEvents(): Promise<DiscordEvent[]> {
        if (this.loading) {
            console.error('Currently loading events');
            return;
        }
        if (!Array.isArray(this.m_events)) {
            try {
                this.loading = true;
                await this.loadEvents();
            } catch (e) {
                console.error('Error trying to load events', e);
            } finally {
                this.loading = false;
            }
        }
        return this.m_events;
    }

    private async loadEvents(): Promise<DiscordEvent[]> {
        this.loading = true;
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file =>
            process.env.DEV_MODE ? file.endsWith('.ts') : file.endsWith('.js')
        );

        this.m_events = [];
        const promises = eventFiles.map((f) => this.loadEvent(path.join(eventsPath, f)));
        await Promise.all(promises);

        this.loading = false;
        return this.m_events;
    }

    private async loadEvent(filePath: string) {
        const { default: event } = await import(filePath);
        this.m_events.push(event as DiscordEvent);
        console.log(`Loading ${event.name} event`);
    }
}