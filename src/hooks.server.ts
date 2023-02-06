import type { Handle } from '@sveltejs/kit'
import { checkAuth } from './lib/auth'
import { _sessionSchema } from './routes/api/check-session/+server'

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session-id')
	const { user } = await checkAuth(sessionId)
	if (user === null && sessionId) {
		event.cookies.delete('session-id')
	}
	event.locals.user = user
	return resolve(event)
}
