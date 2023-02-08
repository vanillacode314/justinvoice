import { entitySchema } from '$/types'

export const GET = makeResultHandler(
	'GET',
	z.null(),
	entitySchema.array(),
	async ({ locals, send }) => {
		const user = locals.user!
		const result = await handleTransaction(() =>
			db.entity.findMany({
				where: {
					userId: user
				}
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)

export const POST = makeResultHandler(
	'POST',
	entitySchema.omit({ id: true }),
	entitySchema,
	async ({ locals, send, data }) => {
		const user = locals.user!
		const { name, address } = data
		const result = await handleTransaction(() =>
			db.entity.create({
				data: {
					name,
					address,
					userId: user
				}
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
