import { db } from '$/lib/db'
import { entitySchema, invoiceItemLogSchema, invoiceSchema } from '$/types'
import type { RequestHandler } from '@sveltejs/kit'
import z from 'zod'

const getIds = (params: Partial<Record<string, string>>) =>
	params.invoiceId?.split(',').map(BigInt) || []

export const GET: RequestHandler = makeResultHandler(
	'GET',
	z.object({
		includeLogs: z.boolean().default(false)
	}),
	z.object({
		invoices: invoiceSchema
			.extend({
				dateOfIssue: dbDateSchema,
				logs: invoiceItemLogSchema.extend({ cost: dbDecimalSchema }).array().default(Array)
			})
			.array()
			.transform((addressbook) => uniqByKey(addressbook, 'id')),
		addressbook: entitySchema.array().transform((addressbook) => uniqByKey(addressbook, 'id'))
	}),
	async ({ send, data, params, locals }) => {
		const { includeLogs } = data
		const ids = getIds(params)
		const user = locals.user!
		const result = await handleTransaction(async () => {
			const invoices = await db.invoice.findMany({
				where: {
					id: { in: ids },
					userId: user
				},
				include: {
					sender: true,
					recipient: true,
					logs: includeLogs
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

export const PUT = makeResultHandler(
	'PUT',
	invoiceSchema
		.omit({ logs: true, id: true })
		.transform((invoice) => {
			return { ...invoice, dateOfIssue: new Date(invoice.dateOfIssue) }
		})
		.refine(
			({ senderId, recipientId }) => {
				return senderId !== recipientId
			},
			{ message: 'Sender and recipient must be different' }
		),
	invoiceSchema.extend({
		dateOfIssue: dbDateSchema,
		logs: invoiceItemLogSchema.extend({ cost: dbDecimalSchema }).array().default(Array)
	}),
	async ({ send, data, params, locals }) => {
		const { dateOfIssue, archived, paid, title, senderId, recipientId, currency } = data
		const id = +params.invoiceId!
		const user = locals.user!
		const result = await handleTransaction(() =>
			db.invoice.update({
				data: {
					title,
					senderId,
					recipientId,
					currency,
					paid,
					archived,
					dateOfIssue,
					userId: user
				},
				include: {
					logs: true
				},
				where: {
					id,
					userId: user
				}
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
			db.invoice.deleteMany({
				where: { id: { in: ids }, userId: user }
			})
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
