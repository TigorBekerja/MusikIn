import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'music'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('artist_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.string('title').notNullable()
      table.string('genre').notNullable()
      table.integer('duration').notNullable()
      table.integer('num_played').defaultTo(0)
      table.integer('year').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}