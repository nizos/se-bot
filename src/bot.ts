import { singleton } from '@aurelia/kernel'
import { Publisher } from './services/publisher'
import { Client } from './client'
import { Config } from './config'
import schedule from 'node-schedule'
import axios from 'axios'

@singleton
export class Bot {
  private readonly publisher: Publisher
  lastUpdate: any
  job: any
  constructor(
    private readonly client: Client,
    private readonly config: Config,
  ) {
    this.publisher = new Publisher(this.config)
    this.lastUpdate = Date.now()
    this.job = schedule.scheduleJob(
      '*/1 * * * *',
      this.refresh.bind(this, this.client, this.publisher),
    )
  }

  async listen(): Promise<string> {
    this.client.on('announcementPosted', (updated_at) => {
      this.lastUpdate = updated_at
    })

    return this.client.login(this.config.token)
  }

  private async refresh(client, publisher) {
    const LAST_UPDATE = this.lastUpdate
    axios.get(this.config.canvasAPI).then((response) => {
      if (response.status === 200) {
        const announcements = response.data.reverse()
        announcements.forEach((announcement) => {
          if (Date.parse(announcement.posted_at) > LAST_UPDATE) {
            publisher.post(client, announcement)
          }
        })
      }
    })
  }
}
