import { db } from '$/db'
import type { RequestHandler } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'

const inputSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(64)
})
const outputSchema = z.object({ id: z.number() })
const send = makeResultHandler(outputSchema)

export const POST = (async ({ request, cookies }) => {
	const data = await handleFormData(inputSchema, await request.formData())
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

	const { email, password } = data
	const user = await db.user.findUnique({
		where: {
			email
		}
	})
	if (!user) {
		return send(
			{
				success: false,
				error: {
					code: 'USER_NOT_FOUND',
					message: 'User not found'
				}
			},
			404
		)
	}

	if (!bcrypt.compareSync(password, user.password)) {
		return send(
			{
				success: false,
				error: {
					code: 'INCORRECT_PASSWORD',
					message: 'Incorrect password'
				}
			},
			400
		)
	}

	const sessionId = bcrypt.hashSync(Math.random().toString())

	await db.user.update({
		where: {
			id: user.id
		},
		data: {
			session: {
				upsert: {
					update: {
						id: sessionId,
						createdAt: new Date()
					},
					create: {
						id: sessionId
					}
				}
			}
		}
	})

	cookies.set('session-id', sessionId, { path: '/' })
	return send({
		success: true,
		data: {
			id: user.id
		}
	})
}) satisfies RequestHandler
