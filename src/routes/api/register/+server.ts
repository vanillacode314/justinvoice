import { db } from '$/db'
import { Prisma } from '@prisma/client'
import type { RequestHandler } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'

const inputSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(64)
})
const outputSchema = z.object({ id: z.number() })
const post = makeResultHandler(outputSchema)

export const POST = (async ({ request, cookies }) => {
	const data = await handleFormData(inputSchema, await request.formData())
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

	const { email, password } = data
	const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	const encryptedKey = bcrypt.hashSync(Math.random().toString())
	const sessionId = bcrypt.hashSync(Math.random().toString())

	try {
		const user = await db.user.create({
			data: {
				encryptedKey,
				email,
				password: hashedPassword,
				session: {
					create: {
						id: sessionId
					}
				}
			},
			select: {
				id: true,
				session: {
					select: {
						id: true
					}
				}
			}
		})

		cookies.set('session-id', sessionId, { path: '/' })

		return post({
			success: true,
			data: { id: user.id }
		})
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2002') {
				return post(
					{
						success: false,
						error: {
							code: 'EMAIL_ALREADY_EXISTS',
							message: e.message
						}
					},
					400
				)
			}
		}

		return post({ success: false, error: { code: 'INTERNAL_ERROR', message: e } }, 500)
	}
}) satisfies RequestHandler
