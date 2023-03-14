import type { Handle } from '@sveltejs/kit'
import * as devalue from 'devalue'
import { checkSession } from './lib/auth'
import { resultSchema } from './types'

function isProtectedRoute(route: string): boolean {
	return /\/v\d+\/private\/.*/gm.test(route)
}

const send = (result: {}, { statusCode = 200 }: Partial<{ statusCode: number }> = {}) => {
	return new Response(devalue.stringify(resultSchema(z.object({})).parse(result)), {
		status: statusCode
	})
}
export const handle: Handle = async ({ event, resolve }) => {
	const offlineMode = Boolean(event.url.searchParams.get('offlineMode'))
	if (offlineMode) {
		event.locals.user = null
		event.locals.expired = false
		event.locals.offlineMode = true
	} else {
		const sessionId = event.cookies.get('session-id')
		const { expired, user } = await checkSession(sessionId)
		event.locals.expired = expired
		if (user === null && sessionId) {
			event.cookies.delete('session-id')
		}
		if (user === null && isProtectedRoute(event.url.pathname)) {
			return send(
				{
					success: false,
					error: {
						code: 'UNAUTHORIZED',
						message: 'Unauthorized session'
					}
				},
				{ statusCode: 401 }
			)
		}
		event.locals.user = user
		event.locals.offlineMode = false
	}
	return resolve(event)
}
