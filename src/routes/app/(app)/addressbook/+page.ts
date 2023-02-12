import { entitySchema, resultSchema } from '$/types'
import { error } from '@sveltejs/kit'
import z from 'zod'
import type { PageLoad } from './$types'

const dataSchema = z.object({
	addressbook: entitySchema.array()
})
const parse = (result: TResult<z.input<typeof dataSchema>>) =>
	resultSchema(dataSchema).parse(result)

export const load = (async ({ url, fetch }) => {
	const fetcher = createFetcher(fetch)
	const $offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if ($offlineMode)
		return parse({
			success: true,
			data: {
				addressbook: []
			}
		})

	const result = await fetcher(entitySchema.array(), '/api/v1/private/entities')
	if (!result.success) throw error(result.statusCode, result.error)
	return parse({
		success: true,
		data: { addressbook: result.data }
	})
}) satisfies PageLoad
