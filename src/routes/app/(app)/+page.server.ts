import { db } from '$/db'
import { entitySchema, invoiceSchema, resultSchema, type TResult } from '$/types'
import z from 'zod'
import type { PageServerLoad } from './$types'

const returnSchema = z.object({
	invoices: invoiceSchema
		.pick({
			id: true,
			dateOfIssue: true,
			title: true,
			senderId: true,
			recipientId: true,
			paid: true
		})
		.extend({
			id: z.number().transform((id) => String(id)),
			recipientId: z.number().transform((id) => String(id)),
			senderId: z.number().transform((id) => String(id))
		})
		.array(),
	addressbook: entitySchema.extend({ id: z.number().transform((id) => String(id)) }).array()
})

function send(result: TResult<z.input<typeof returnSchema>>) {
	return resultSchema(returnSchema).parse(result)
}

export const load = (async ({ url, locals }) => {
	const offlineMode = Boolean(url.searchParams.get('offlineMode'))

	if (offlineMode) {
		return send({
			success: true,
			data: {
				invoices: [],
				addressbook: []
			}
		})
	}

	const { user } = locals
	if (!user) {
		return send({
			success: true,
			data: {
				invoices: [],
				addressbook: []
			}
		})
	}

	const invoices = await db.invoice.findMany({
		where: {
			userId: user
		},
		select: {
			id: true,
			paid: true,
			title: true,
			dateOfIssue: true,
			sender: {
				select: {
					id: true,
					name: true,
					address: true
				}
			},
			recipient: {
				select: {
					id: true,
					name: true,
					address: true
				}
			}
		}
	})

	return send({
		success: true,
		data: {
			invoices: invoices.map(({ id, dateOfIssue, paid, title, sender, recipient }) => ({
				id,
				paid,
				title,
				dateOfIssue: dateOfIssue.getTime(),
				senderId: sender.id,
				recipientId: recipient.id
			})),
			addressbook: invoices.flatMap(({ sender, recipient }) => [sender, recipient])
		}
	})
}) satisfies PageServerLoad
