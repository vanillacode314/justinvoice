import { checkSession } from '$/lib/auth'
import type { RequestHandler } from '@sveltejs/kit'
import * as devalue from 'devalue'

export const GET: RequestHandler = async ({ cookies }) => {
	const data = await checkSession(cookies.get('session-id'))
	return new Response(devalue.stringify(data), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
