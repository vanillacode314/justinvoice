import { entitySchema, resultSchema } from '$/types'
import z from 'zod'
import type { PageLoad } from './$types'

const dataSchema = z.object({
	addressbook: entitySchema.array()
})
const parse = (result: TResult<z.input<typeof dataSchema>>) =>
	resultSchema(dataSchema).parse(result)

export const load = (async ({ parent, url, fetch }) => {
	const fetcher = createFetcher(fetch)
	const $offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if (!$offlineMode) {
		const { user } = await parent()
		if (!user) {
			return parse({
				success: true,
				data: {
					addressbook: []
				}
			})
		}

		const result = await fetcher(resultSchema(entitySchema.array()), '/api/v1/private/entities')
		if (!result.success) {
			return parse({
				success: true,
				data: {
					addressbook: []
				}
			})
		}
		return parse({
			success: true,
			data: { addressbook: result.data }
		})
	}

	return parse({
		success: true,
		data: {
			addressbook: []
		}
	})
}) satisfies PageLoad
