import { db } from '$/db'
import type { TResult } from '$/types'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET = (async ({ cookies }) => {
	const sessionId = cookies.get('session-id')
	if (!sessionId) {
		return json({
			success: false,
			error: { code: 'NO_SESSION', message: 'No session to log out from' }
		} satisfies TResult)
	}

	cookies.delete('session-id', { path: '/' })

	await db.session.delete({
		where: {
			id: sessionId
		}
	})

	return json({ success: true, data: {} } satisfies TResult)
}) satisfies RequestHandler
