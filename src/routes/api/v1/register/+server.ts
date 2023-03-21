import { db } from '$/lib/db'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const POST = makeResultHandler(
	'POST',
	z.object({
		email: z.string().email(),
		password: z.string().min(8).max(64)
	}),
	z.object({ id: z.bigint() }),
	async ({ send, data, cookies }) => {
		const { email, password } = data
		const hashedPassword = await hashPassword(password)
		const encryptedKey = await hashPassword(Math.random().toString())
		const sessionId = await hashPassword(Math.random().toString())

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

			cookies.set('session-id', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge: 1000 * 60 * 60 * 24 * 30
			})
			return send({
				success: true,
				data: { id: user.id }
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return send(
						{
							success: false,
							error: {
								code: 'EMAIL_ALREADY_EXISTS',
								message: 'Email already in use'
							}
						},
						{
							statusCode: 500
						}
					)
				}
			}
			return send(
				{ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } },
				{ statusCode: 500 }
			)
		}
	}
)