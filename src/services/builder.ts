import { singleton } from '@aurelia/kernel'
import { MessageEmbed } from 'discord.js'
import { Formatter } from './formatter'

@singleton
export class Builder {
  private readonly formatter: Formatter
  private readonly previewSize: number
  constructor() {
    this.formatter = new Formatter()
    this.previewSize = 4000
  }
  embed = (body) => {
    const message = this.formatter.strip(body.message)
    const messageEmbed = new MessageEmbed()
    messageEmbed.setTitle(body.title)
    messageEmbed.setURL(body.url)
    messageEmbed.setAuthor(
      body.author.display_name,
      body.author.avatar_image_url,
      body.author.html_url,
    )
    messageEmbed.setDescription(message.substring(0, this.previewSize))
    messageEmbed.addFields({
      name: '___________',
      value: '[Läs mer](' + body.url + ')',
    })
    messageEmbed.setTimestamp()
    messageEmbed.setFooter('Canvas', 'https://i.imgur.com/QyTY80E.png')
    return { embeds: [messageEmbed] }
  }
}
