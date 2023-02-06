import { db } from '$/db'
import {
	entitySchema,
	invoiceItemLogSchema,
	invoiceSchema,
	resultSchema,
	type TResult
} from '$/types'
import z from 'zod'
import type { PageServerLoad } from './$types'

const dataSchema = z.object({
	invoice: invoiceSchema
		.pick({
			id: true,
			dateOfIssue: true,
			title: true,
			senderId: true,
			recipientId: true,
			paid: true,
			logs: true
		})
		.extend({
			id: z.number().transform(String),
			recipientId: z.number().transform(String),
			senderId: z.number().transform(String),
			logs: invoiceItemLogSchema
				.extend({
					id: z.number().transform(String)
				})
				.array()
		})
		.partial(),
	addressbook: entitySchema.extend({ id: z.number().transform((id) => String(id)) }).array()
})

const send = (result: TResult<z.input<typeof dataSchema>>) => resultSchema(dataSchema).parse(result)

export const load = (async ({ params, url, locals }) => {
	const offlineMode = Boolean(url.searchParams.get('offlineMode'))

	if (offlineMode) {
		return send({
			success: true,
			data: {
				invoice: {},
				addressbook: []
			}
		})
	}

	const { user } = locals
	if (!user) {
		return send({
			success: true,
			data: {
				invoice: {},
				addressbook: []
			}
		})
	}

	const invoice = await db.invoice.findUnique({
		where: {
			id: +params.id
		},
		select: {
			id: true,
			paid: true,
			title: true,
			dateOfIssue: true,
			sender: true,
			recipient: true,
			logs: {
				select: {
					id: true,
					title: true,
					description: true,
					cost: true,
					qty: true,
					type: true
				}
			}
		}
	})

	if (!invoice) {
		return send({
			success: true,
			data: {
				invoice: {},
				addressbook: []
			}
		})
	}

	return send({
		success: true,
		data: {
			invoice: {
				...invoice,
				dateOfIssue: invoice.dateOfIssue.getTime(),
				senderId: invoice.sender.id,
				recipientId: invoice.recipient.id,
				logs: invoice.logs.map((log) => ({ ...log, cost: +log.cost.valueOf() }))
			},
			addressbook: [invoice.sender, invoice.recipient]
		}
	})
}) satisfies PageServerLoad
