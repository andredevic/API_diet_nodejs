import { FastifyInstance } from 'fastify'
import { db } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.get('/', async (request) => {
    const { user } = request
    const meals = await db('meals').where({ user_id: user?.id }).select()
    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getMealParamsSchema.parse(request.params)
    const { user } = request

    const meal = await db('meals')
      .where({
        id,
        user_id: user?.id,
      })
      .first()

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    return { meal }
  })

  app.get('/metrics', async (request) => {
    const { user } = request
    const totalMeals = await db('meals')
      .where({ user_id: user?.id })
      .orderBy('date', 'desc')

    const totalMealsOnDiet = await db('meals')
      .where({ user_id: user?.id, is_on_diet: true })
      .count('id', { as: 'total' })
      .first()

    const totalMealsOffDiet = await db('meals')
      .where({ user_id: user?.id, is_on_diet: false })
      .count('id', { as: 'total' })
      .first()

    let bestOnDietSequence = 0
    let currentSequence = 0
    for (const meal of totalMeals) {
      if (meal.is_on_diet) {
        currentSequence++
      } else {
        currentSequence = 0
      }
      if (currentSequence > bestOnDietSequence) {
        bestOnDietSequence = currentSequence
      }
    }

    return {
      totalMeals: totalMeals.length,
      totalMealsOnDiet: totalMealsOnDiet?.total || 0,
      totalMealsOffDiet: totalMealsOffDiet?.total || 0,
      bestOnDietSequence,
    }
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    const { name, description, isOnDiet, date } = createMealBodySchema.parse(
      request.body,
    )

    await db('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.toISOString(),
      user_id: request.user?.id,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = updateMealParamsSchema.parse(request.params)

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
      request.body,
    )

    const meal = await db('meals')
      .where({ id, user_id: request.user?.id })
      .first()

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    await db('meals').where({ id }).update({
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.toISOString(),
    })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = deleteMealParamsSchema.parse(request.params)

    const meal = await db('meals')
      .where({ id, user_id: request.user?.id })
      .first()

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found' })
    }

    await db('meals').where({ id }).delete()

    return reply.status(204).send()
  })
}

// tasks
// criar rota de users
// criar middleware
// criar no @types os fastify.d.ts
// arrumar rota post de meals
// mudar migration do banco
// criar as outras rotas
// testar rotas no insomnia
// realizar testes
