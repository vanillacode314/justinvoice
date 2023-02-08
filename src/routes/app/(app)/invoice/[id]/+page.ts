import { entitySchema, invoiceSchema, resultSchema } from '$/types'
import z from 'zod'
import type { PageLoad } from './$types'

const dataSchema = z.object({
	invoices: invoiceSchema.array(),
	addressbook: entitySchema.array()
})

const send = (result: TResult<z.input<typeof dataSchema>>) => resultSchema(dataSchema).parse(result)

export const load = (async ({ parent, url, params, fetch }) => {
	const fetcher = createFetcher(fetch)
	const $offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if (!$offlineMode) {
		const { user } = await parent()
		if (user === null) {
			return send({
				success: true,
				data: {
					invoices: [],
					addressbook: []
				}
			})
		}

		const result = await fetcher(
			resultSchema(dataSchema),
			`/api/v1/private/invoices/${params.id}?` +
				buildQueryString({
					includeLogs: true
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
