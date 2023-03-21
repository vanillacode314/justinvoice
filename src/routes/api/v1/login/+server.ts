import { db } from '$/lib/db'
import { hashPassword } from '$/utils/server'
import type { RequestHandler } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'

export const POST: RequestHandler = makeResultHandler(
	'POST',
	z.object({
		email: z.string().email(),
		password: z.string().min(8).max(64)
	}),
	z.object({ id: z.bigint() }),
	async ({ send, data, cookies }) => {
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
						code: 'INVALID_CREDENTIALS',
						message: 'username or password is invalid'
					}
				},
				{ statusCode: 400 }
			)
		}

		if (!(await bcrypt.compare(password, user.password))) {
			return send(
				{
					success: false,
					error: {
						code: 'INVALID_CREDENTIALS',
						message: 'username or password is invalid'
					}
				},
				{ statusCode: 400 }
			)
		}

		const sessionId = await hashPassword(Math.random().toString())

		await db.user.update({
			where: {
				id: user.id
			},
			data: {
				session: {
					create: {
						id: sessionId,
						createdAt: new Date()
					}
				}
			}
		})

		cookies.set('session-id', sessionId, {
			path: '/',
			secure: true,
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 30
		})
		return send({
			success: true,
			data: {
				id: user.id
			}
		})
	}
)
