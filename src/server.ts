import fastify from 'fastify'
import { db } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', () => async () => {
  const tables = await db('sqlite_schema').select('*')
  return tables
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running')
})
