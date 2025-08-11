import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Music extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare artist_id: number

  @column()
  declare title: string

  @column()
  declare genre: string

  @column()
  declare duration: number

  @column()
  declare num_played: number

  @column()
  declare year: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}