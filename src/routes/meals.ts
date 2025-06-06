import { FastifyInstance } from 'fastify'
import { db } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    const { name, description, isOnDiet, date } = createMealsBodySchema.parse(
      request.body,
    )
    await db('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date,
    })
    return reply.status(201).send({ message: 'Refeição criada com sucesso' })
  })
}
