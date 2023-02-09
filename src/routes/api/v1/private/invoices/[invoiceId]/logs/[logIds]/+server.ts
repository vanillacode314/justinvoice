import { invoiceItemLogSchema } from '$/types'

const getIds = (params: Partial<Record<string, string>>) =>
	params.logIds?.split(',').map(BigInt) || []

export const GET = makeResultHandler(
	'GET',
	z.null(),
	invoiceItemLogSchema.extend({ cost: dbDecimalSchema }).array(),
	async ({ send, params, locals }) => {
		const invoiceId = +params.invoiceId!
		const ids = getIds(params)
		const user = locals.user!
		const result = await handleTransaction(() =>
			db.log.findMany({
				where: {
					id: { in: ids },
					invoiceId,
					invoice: {
						userId: user
					}
				}
			})
		)
		return send(result)
	}
)

export const PUT = makeResultHandler(
	'PUT',
	invoiceItemLogSchema.omit({ id: true }),
	invoiceItemLogSchema.extend({ cost: dbDecimalSchema }),
	async ({ send, data, params, locals }) => {
		const user = locals.user!
		const invoiceId = +params.invoiceId!
		const id = +params.logIds!
		const result = await handleTransaction(() =>
			db.log.update({
				data: data,
				where: { id, invoiceId, invoice: { userId: user } }
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)

export const DELETE = makeResultHandler(
	'DELETE',
	z.null(),
	z.object({ count: z.number() }),
	async ({ send, locals, params }) => {
		const user = locals.user!
		const invoiceId = +params.invoiceId!
		const ids = getIds(params)
		const result = await handleTransaction(() =>
			db.log.deleteMany({
				where: { id: { in: ids }, invoiceId, invoice: { userId: user } }
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
