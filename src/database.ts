import knex, { Knex } from 'knex'
import { env } from './env'
import path from 'path'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(env.DATABASE_URL),
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}
console.log('Database path:', path.resolve(env.DATABASE_URL))
export const db = knex(config)
