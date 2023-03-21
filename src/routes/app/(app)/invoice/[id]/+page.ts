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
	let id: bigint

	try {
		id = BigInt(params.id)
	} catch {
		throw error(400, { message: 'Invalid Invoice ID: ' + params.id, code: 'INVALID_INVOICE_ID' })
	}

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
		`/api/v1/private/invoices/${id}?` +
			buildQueryString({
				includeLogs: true,
				archived: null
			})
	)
	if (!result.success) throw error(result.statusCode, result.error)
	return send(result)
}) satisfies PageLoad