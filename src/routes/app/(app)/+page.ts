import { appState, userState } from '$/stores'
import { entitySchema, invoiceSchema, resultSchema } from '$/types'
import { error } from '@sveltejs/kit'
import z from 'zod'
import type { PageLoad } from './$types'

const dataSchema = z.object({
	invoices: invoiceSchema.array(),
	addressbook: entitySchema.array()
})

const send = (result: TResult<z.input<typeof dataSchema>>) => resultSchema(dataSchema).parse(result)
export const load = (async ({ depends, url, fetch }) => {
	depends('filter')
	const fetcher = createFetcher(fetch)
	const $offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if ($offlineMode) {
		return send({
			success: true,
			data: {
				invoices: [],
				addressbook: []
			}
		})
	}

	const filters = get(appState).invoiceFilters
	const result = await fetcher(
		dataSchema,
		'/api/v1/private/invoices?' +
			buildQueryString({
				includeLogs: false,
				archived: false,
				paid: filters.paid,
				query: filters.query
			})
	)
	if (!result.success) throw error(result.statusCode, result.error)
	return result
}) satisfies PageLoad
