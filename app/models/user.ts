import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import Hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username : string

  @column()
  declare email : string

  @column({serializeAs: 'password'})
  declare password : string

  @column() 
  declare favorite_artist_id? : number 

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}