import { db } from '$/db'
import z from 'zod'

const MONTH_IN_MILLIS = 1000 * 60 * 60 * 24 * 30
const EXPIRATION_DURATION_MILLIS = MONTH_IN_MILLIS

export const sessionSchema = z.object({
	expired: z.boolean(),
	user: z.number().nullable()
})

export async function checkAuth(sessionId?: string): Promise<z.infer<typeof sessionSchema>> {
	if (!sessionId) {
		return {
			expired: false,
			user: null
		}
	}

	const session = await db.session.findUnique({
		where: {
			id: sessionId
		},
		select: {
			user: {
				select: {
					id: true
				}
			},
			createdAt: true
		}
	})

	if (!session) {
		return {
			expired: false,
			user: null
		}
	}

	const SESSION_AGE_MILLIS = Date.now() - session.createdAt.getTime()
	if (SESSION_AGE_MILLIS >= EXPIRATION_DURATION_MILLIS) {
		await db.session.delete({
			where: {
				id: sessionId
			}
		})

		return {
			expired: true,
			user: null
		}
	}

	return {
		expired: false,
		user: session.user.id
	}
}
