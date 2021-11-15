import { Client as DiscordClient, Intents } from 'discord.js'

export class Client extends DiscordClient {
  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    })
  }
}
