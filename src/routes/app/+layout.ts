import { offlineMode } from '$/stores'
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

const sessionSchema = z.object({
	expired: z.boolean(),
	user: z.bigint().nullable()
})

const AUTH_ROUTES = ['/register', '/login']
export const load = (async ({ depends, url, fetch }) => {
	if (!browser) return { user: null, expired: false }
	const fetcher = createFetcher(fetch)

	depends('offlineMode')
	const $offlineMode = get(offlineMode)
	const urlState = Boolean(url.searchParams.get('offlineMode'))
	if (urlState !== $offlineMode) {
		const _url = new URL(url)
		$offlineMode
			? _url.searchParams.set('offlineMode', 'true')
			: _url.searchParams.delete('offlineMode')
		await goto(_url)
	}

	const route = url.pathname.replace('/app', '')
	if ($offlineMode) {
		if (AUTH_ROUTES.includes(route)) {
			throw redirect(303, '/app?offlineMode=true')
		}
		return { user: null, expired: false }
	}

	const { user, expired } = await fetcher(sessionSchema, '/api/v1/check-session')
	if (user === null) {
		if (!AUTH_ROUTES.includes(route)) {
			throw redirect(303, '/app/login')
		}
	} else {
		if (AUTH_ROUTES.includes(route)) {
			throw redirect(303, '/app' + url.search)
		}
	}

	return { user, expired }
}) satisfies LayoutLoad
