import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.integer('music_id').unsigned().references('id').inTable('music').onDelete('CASCADE').notNullable()
      table.integer('num_played').defaultTo(1)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}