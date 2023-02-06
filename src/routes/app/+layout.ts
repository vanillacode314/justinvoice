import { userState } from '$/stores'
import { browser } from '$app/environment'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

const sessionSchema = z.object({
	expired: z.boolean(),
	user: z.number().nullable()
})

export const load: LayoutLoad = async ({ url, fetch }) => {
	if (!browser) return

	if (get(userState).offlineMode) {
		return { user: null, expired: false }
	}

	const { user, expired } = sessionSchema.parse(
		await fetch('/api/check-session').then((res) => res.json())
	)
	const loggedIn = user !== null

	const route = url.pathname.replace('/app', '')
	switch (route) {
		case '/register':
			if (loggedIn) {
				throw redirect(303, '/app')
			}
			break
		case '/login':
			if (loggedIn) {
				throw redirect(303, '/app')
			}
			break
		default:
			if (!loggedIn) {
				throw redirect(303, '/app/login' + (expired ? '?expired=true' : ''))
			}
			break
	}

	return { user, expired }
}
