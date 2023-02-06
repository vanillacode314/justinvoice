import { db } from '$/db'
import { entitySchema, resultSchema, type TResult } from '$/types'
import z from 'zod'
import type { PageServerLoad } from './$types'

const dataSchema = z.object({
	addressbook: entitySchema.extend({ id: z.number().transform((id) => String(id)) }).array()
})
const parse = (result: TResult<z.input<typeof dataSchema>>) =>
	resultSchema(dataSchema).parse(result)

export const load = (async ({ url, locals }) => {
	const offlineMode = Boolean(url.searchParams.get('offlineMode'))
	if (offlineMode) {
		return parse({
			success: true,
			data: {
				addressbook: []
			}
		})
	}

	const { user } = locals
	if (!user) {
		return parse({
			success: true,
			data: {
				addressbook: []
			}
		})
	}
	const entities = await db.entity.findMany({
		where: {
			userId: user
		},
		select: {
			id: true,
			name: true,
			address: true
		}
	})

	return parse({
		success: true,
		data: {
			addressbook: entities
		}
	})
}) satisfies PageServerLoad
