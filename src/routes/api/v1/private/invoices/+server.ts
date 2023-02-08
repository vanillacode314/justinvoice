import { entitySchema, invoiceItemLogSchema, invoiceSchema } from '$/types'

export const GET = makeResultHandler(
	'GET',
	z.object({
		includeLogs: z.boolean().default(false),
		archived: z.boolean().nullable().default(false)
	}),
	z.object({
		invoices: invoiceSchema
			.extend({
				dateOfIssue: dbDateSchema,
				logs: invoiceItemLogSchema.extend({ cost: dbDecimalSchema }).array().default(Array)
			})
			.array()
			.transform((invoices) => uniqByKey(invoices, 'id')),
		addressbook: entitySchema.array().transform((addressbook) => uniqByKey(addressbook, 'id'))
	}),
	async ({ locals, send, data }) => {
		const { archived, includeLogs } = data
		const user = locals.user!
		const result = await handleTransaction(async () => {
			const invoices = await db.invoice.findMany({
				where: {
					userId: user,
					archived: archived === null ? undefined : archived
				},
				include: {
					logs: includeLogs,
					sender: true,
					recipient: true
				}
			})
			return {
				invoices,
				addressbook: invoices.flatMap((invoice) => [invoice.sender, invoice.recipient])
			}
		})
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)

export const POST = makeResultHandler(
	'POST',
	invoiceSchema.omit({ id: true }).refine(
		({ senderId, recipientId }) => {
			return senderId !== recipientId
		},
		{ message: 'Sender and recipient must be different' }
	),
	invoiceSchema.extend({
		dateOfIssue: dbDateSchema
	}),
	async ({ send, data, locals }) => {
		const { title, senderId, recipientId, currency } = data
		const user = locals.user!
		const result = await handleTransaction(() =>
			db.invoice.create({
				data: {
					title,
					senderId: +senderId,
					recipientId: +recipientId,
					currency,
					userId: user
				}
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
