import { db } from '$/db'
import { invoiceItemLogSchema } from '$/types'
import type { RequestHandler } from '@sveltejs/kit'
import z from 'zod'

const postInputSchema = invoiceItemLogSchema
	.pick({
		title: true,
		type: true,
		description: true,
		qty: true,
		cost: true
	})
	.extend({
		invoiceId: z.number()
	})

const postOutputSchema = invoiceItemLogSchema
	.pick({ id: true })
	.extend({ id: z.number().transform(String) })

const send = makeResultHandler(postOutputSchema)

export const POST = (async ({ request, locals }) => {
	const data = await handleFormData(postInputSchema, await request.formData())
	if (!data) {
		return send(
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
	if (user === null) {
		return send(
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

	const { title, cost, qty, description, type, invoiceId } = data
	const log = await db.log.create({
		data: {
			title,
			cost,
			type,
			qty,
			description,
			invoiceId
		},
		select: { id: true }
	})

	return send({
		success: true,
		data: log
	})
}) satisfies RequestHandler
