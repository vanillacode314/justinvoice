import { entitySchema, invoiceSchema, resultSchema } from '$/types'
import z from 'zod'
import type { PageLoad } from './$types'

const dataSchema = z.object({
	invoices: invoiceSchema.array(),
	addressbook: entitySchema.array()
})

const send = (result: TResult<z.input<typeof dataSchema>>) => resultSchema(dataSchema).parse(result)
export const load = (async ({ url, fetch }) => {
	const fetcher = createFetcher(fetch)
	const $offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if (!$offlineMode) {
		const result = await fetcher(
			resultSchema(dataSchema),
			'/api/v1/private/invoices?' +
				buildQueryString({
					includeLogs: false
				})
		)
		if (!result.success) {
			return send({
				success: true,
				data: {
					invoices: [],
					addressbook: []
				}
			})
		}

		return send({
			success: true,
			data: result.data
		})
	}
	return send({
		success: true,
		data: {
			invoices: [],
			addressbook: []
		}
	})
}) satisfies PageLoad
