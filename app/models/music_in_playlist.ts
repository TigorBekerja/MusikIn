import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Music from '#models/music'
import Playlist from '#models/playlist'

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

  @belongsTo(() => Playlist, { foreignKey: 'playlist_id' })
  declare playlist: BelongsTo<typeof Playlist>

  @belongsTo(() => Music, { foreignKey: 'music_id' })
  declare music: BelongsTo<typeof Music>
}