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
