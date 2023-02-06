import { db } from '$/db'
import { invoiceSchema } from '$/types'
import type { RequestHandler } from '@sveltejs/kit'
import z from 'zod'

const postInputSchema = invoiceSchema
	.pick({
		title: true,
		senderId: true,
		recipientId: true,
		currency: true
	})
	.extend({
		senderId: z.number().transform(String),
		recipientId: z.number().transform(String)
	})
const postOutputSchema = invoiceSchema.pick({ id: true }).extend({
	id: z.number().transform(String)
})

const post = makeResultHandler(postOutputSchema)

export const POST = (async ({ request, locals }) => {
	const data = await handleFormData(postInputSchema, await request.formData())
	if (!data) {
		return post(
			{
				success: false,
				error: {
					code: 'INVALID_FORM_DATA',
					message: 'Invalid form data'
				}
			},
			400
		)
	}

	const { user } = locals
	if (!user) {
		return post(
			{
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'No authorized session'
				}
			},
			401
		)
	}

	const { title, senderId, recipientId, currency } = data
	const invoice = await db.invoice.create({
		data: {
			title,
			senderId: +senderId,
			recipientId: +recipientId,
			currency,
			userId: user
		},
		select: { id: true }
	})

	return post({ success: true, data: invoice })
}) satisfies RequestHandler

const deleteInputSchema = z.object({ ids: z.string().transform(Number).array() })
const deleteOutputSchema = z.object({ count: z.number() })
const _delete = makeResultHandler(deleteOutputSchema)

export const DELETE = (async ({ request, locals }) => {
	const data = await handleFormData(deleteInputSchema, await request.formData())
	if (!data) {
		return post(
			{
				success: false,
				error: {
					code: 'INVALID_FORM_DATA',
					message: 'Invalid form data'
				}
			},
			400
		)
	}

	const { user } = locals
	if (!user) {
		return post(
			{
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'No authorized session'
				}
			},
			401
		)
	}

	const { ids } = data
	const { count } = await db.invoice.deleteMany({
		where: { id: { in: ids } }
	})

	return _delete({ success: true, data: { count } })
}) satisfies RequestHandler
