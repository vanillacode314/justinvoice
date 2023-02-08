import type { LayoutServerLoad } from './$types'

const sessionSchema = z.object({
	expired: z.boolean(),
	user: z.number().nullable()
})

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		offlineMode: locals.offlineMode
	}
}
