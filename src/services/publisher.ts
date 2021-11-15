import { singleton } from '@aurelia/kernel'
import { Builder } from './builder'
import { Config } from '../config'

@singleton
export class Publisher {
  private readonly builder: Builder
  private readonly config: Config
  constructor(config: Config) {
    this.config = config
    this.builder = new Builder()
  }

  post(client, message) {
    const posted_at = Date.parse(message.posted_at)
    const embed = this.builder.embed(message)
    client.channels
      .fetch(this.config.channel)
      .then((channel) => {
        channel.send(embed)
        client.emit('announcementPosted', posted_at)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
