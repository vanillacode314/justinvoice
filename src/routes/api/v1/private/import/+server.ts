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
		const { invoices, addressbook } = data
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
		const [INVOICES, ADDRESSBOOK] = [0, 1] as const
		const _data = result.data
		filterInPlace(invoices, (invoice) => !_data[INVOICES].some(({ id }) => invoice.id === id))
		filterInPlace(addressbook, (address) => !_data[ADDRESSBOOK].some(({ id }) => address.id === id))
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
