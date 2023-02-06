import { db } from '$/db'
import { entitySchema } from '$/types'
import type { RequestHandler } from '@sveltejs/kit'
import z from 'zod'

const getOutputSchema = entitySchema.required().array()
const send = makeResultHandler(getOutputSchema)

export const GET = (async ({ locals }) => {
	const { user } = locals
	if (!user) {
		return send(
			{
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'No authorized session'
				}
			},
			401
		)
	}

	const entities = await db.entity.findMany({
		where: {
			userId: user
		},
		select: {
			id: true,
			name: true,
			address: true
		}
	})

	return send({
		success: true,
		data: entities.map((entity) => ({ ...entity, id: `${entity.id}` }))
	})
}) satisfies RequestHandler

const postInputSchema = entitySchema.pick({
	name: true,
	address: true
})
const postOutputSchema = entitySchema.pick({ id: true }).extend({
	id: z.number().transform(String)
})
const post = makeResultHandler(postOutputSchema)

export const POST = (async ({ locals, request }) => {
	const data = await handleFormData(postInputSchema, await request.formData())
	if (!data) {
		return post(
			{
				success: false,
				error: {
					code: 'INVALID_FORM_DATA',
					message: 'No value provided'
				}
			},
			400
		)
	}

	const { user } = locals
	if (!user) {
		return post(
			{
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'No authorized session'
				}
			},
			401
		)
	}

	const { name, address } = data
	const entity = await db.entity.create({
		data: {
			name,
			address,
			userId: user
		}
	})

	return post({ success: true, data: entity })
}) satisfies RequestHandler

const deleteInputSchema = z.object({
	ids: z.string().array().transform(Number)
})
const deleteOutputSchema = z.object({ count: z.number() })
const _delete = makeResultHandler(deleteOutputSchema)

export const DELETE = (async ({ request, locals }) => {
	const data = await handleFormData(deleteInputSchema, await request.formData())
	if (!data) {
		return post(
			{
				success: false,
				error: {
					code: 'INVALID_FORM_DATA',
					message: 'No value provided'
				}
			},
			400
		)
	}

	const { user } = locals
	if (!user) {
		return post(
			{
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'No authorized session'
				}
			},
			401
		)
	}

	const { ids } = data
	const { count } = await db.entity.deleteMany({
		where: {
			id: { in: ids }
		}
	})

	return _delete({ success: true, data: { count } })
}) satisfies RequestHandler
