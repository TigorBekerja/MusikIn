import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'music_in_playlists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('playlist_id').unsigned().references('id').inTable('playlists').onDelete('CASCADE').notNullable()
      table.integer('music_id').unsigned().references('id').inTable('music').onDelete('CASCADE').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}