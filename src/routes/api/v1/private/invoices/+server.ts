import { entitySchema, invoiceItemLogSchema, invoiceSchema } from '$/types'

export const GET = makeResultHandler(
	'GET',
	z.object({
		includeLogs: z.boolean().default(false),
		archived: z.boolean().nullable().default(false),
		paid: z.boolean().nullable().default(null),
		query: z.string().nullable().default(null)
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
		const { paid, archived, query, includeLogs } = data
		const user = locals.user!
		const result = await handleTransaction(async () => {
			const invoices = await db.invoice.findMany({
				where: {
					userId: user,
					archived: archived === null ? undefined : archived,
					paid: paid === null ? undefined : paid,
					title:
						query === null
							? undefined
							: {
									contains: query
							  }
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
	invoiceSchema
		.omit({ dateOfIssue: true, logs: true, id: true })
		.refine((data) => data.senderId !== -1n, { message: 'Choose a sender' })
		.refine((data) => data.recipientId !== -1n, { message: 'Choose a recipient' })
		.refine(
			(data) =>
				(data.senderId === -1n && data.recipientId === -1n) || data.recipientId !== data.senderId,
			{
				message: 'Recipient and Sender cannot be same'
			}
		),
	invoiceSchema.extend({
		dateOfIssue: dbDateSchema,
		logs: invoiceItemLogSchema.extend({ cost: dbDecimalSchema }).array().default(Array)
	}),
	async ({ send, data, locals }) => {
		const user = locals.user!
		const result = await handleTransaction(() =>
			db.invoice.create({
				data: {
					...data,
					userId: user
				},
				include: {
					logs: true
				}
			})
		)
		return send(result, { statusCode: result.success ? 201 : 500 })
	}
)
