import { db } from '$/lib/db'
import { entitySchema } from '$/types'
import z from 'zod'

const getIds = (params: Partial<Record<string, string>>) => params.ids?.split(',').map(Number) || []

export const PUT = makeResultHandler(
	'PUT',
	entitySchema.omit({ id: true }),
	entitySchema,
	async ({ locals, params, send, data }) => {
		const user = locals.user!
		const { name, address } = data
		const id = +params.ids!
		const result = await handleTransaction(() =>
			db.entity.update({
				data: {
					name,
					address,
					userId: user
				},
				where: { id }
			})
		)

		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)

export const DELETE = makeResultHandler(
	'DELETE',
	z.null(),
	z.object({
		count: z.number()
	}),
	async ({ send, params, locals }) => {
		const user = locals.user!
		const ids = getIds(params)
		const result = await handleTransaction(() =>
			db.entity.deleteMany({
				where: {
					id: { in: ids },
					userId: user
				}
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
