import { entitySchema, invoiceSchema } from '$/types'

export const POST = makeResultHandler(
	'POST',
	z.object({
		invoices: invoiceSchema.array(),
		addressbook: entitySchema.array()
	}),
	z.object({}),
	async ({ send, data, locals }) => {
		const user = locals.user!
		let { invoices, addressbook } = data
		let result = await handleTransaction(() =>
			db.$transaction([
				db.invoice.findMany({
					where: {
						id: {
							in: invoices.map((invoice) => invoice.id)
						}
					}
				}),
				db.entity.findMany({
					where: {
						id: {
							in: addressbook.map((address) => address.id)
						}
					}
				})
			])
		)
		if (!result.success) {
			return send(result)
		}
		const _data = result.data
		invoices = invoices.filter((invoice) => !_data[0].some(({ id }) => invoice.id === id))
		addressbook = addressbook.filter((address) => !_data[1].some(({ id }) => address.id === id))
		result = await handleTransaction(() =>
			db
				.$transaction([
					db.entity.createMany({
						data: addressbook.map((address) => ({ ...address, userId: user }))
					}),
					db.invoice.createMany({
						data: invoices.map((invoice) => ({
							...invoiceSchema.omit({ logs: true }).parse(invoice),
							dateOfIssue: new Date(invoice.dateOfIssue),
							userId: user
						}))
					}),
					db.log.createMany({
						data: invoices.flatMap((invoice) =>
							invoice.logs.map((log) => ({ ...log, invoiceId: invoice.id }))
						)
					})
				])
				.then(() => ({}))
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
