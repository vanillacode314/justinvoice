import { checkAuth } from '$/lib/auth'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ cookies }) => {
	const data = await checkAuth(cookies.get('session-id'))
	return json(data)
}
