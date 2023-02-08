import { invoiceItemLogSchema } from '$/types'

export const GET = makeResultHandler(
	'GET',
	z.null(),
	invoiceItemLogSchema.extend({ cost: dbDecimalSchema }).array(),
	async ({ send, params, locals }) => {
		const invoiceId = +params.invoiceId!
		const user = locals.user!
		const result = await handleTransaction(() =>
			db.log.findMany({
				where: {
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

export const POST = makeResultHandler(
	'POST',
	invoiceItemLogSchema.omit({ id: true }),
	invoiceItemLogSchema.extend({ cost: dbDecimalSchema }),
	async ({ data, params, send }) => {
		const invoiceId = +params.invoiceId!
		const { title, cost, qty, description, type } = data
		const result = await handleTransaction(() =>
			db.log.create({
				data: {
					title,
					cost,
					type,
					qty,
					description,
					invoiceId
				}
			})
		)
		return send(result)
	}
)
