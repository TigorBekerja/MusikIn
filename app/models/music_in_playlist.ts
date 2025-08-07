import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MusicInPlaylist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare playlist_id: number

  @column()
  declare music_id: number
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}