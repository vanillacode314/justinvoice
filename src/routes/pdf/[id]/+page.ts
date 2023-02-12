import { entitySchema, invoiceSchema, resultSchema } from '$/types'
import { error } from '@sveltejs/kit'
import z from 'zod'
import type { PageLoad } from './$types'

const dataSchema = z.object({
	invoices: invoiceSchema.array(),
	addressbook: entitySchema.array()
})

const send = (result: TResult<z.input<typeof dataSchema>>) => resultSchema(dataSchema).parse(result)

export const load = (async ({ url, params, fetch }) => {
	const fetcher = createFetcher(fetch)
	const $offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if ($offlineMode)
		return send({
			success: true,
			data: {
				invoices: [],
				addressbook: []
			}
		})

	const result = await fetcher(
		dataSchema,
		`/api/v1/private/invoices/${params.id}?` +
			buildQueryString({
				includeLogs: true
			})
	)
	if (!result.success) throw error(result.statusCode, result.error)
	return result
}) satisfies PageLoad
