import { entitySchema, invoiceSchema } from '$/types'
import type { Readable } from 'svelte/store'
import { z } from 'zod'

export const actionSchema = z.object({
	icon: z.string(),
	color: z.string().default(''),
	label: z.string(),
	action: z.function(),
	noClose: z.boolean().default(false),
	noFab: z.boolean().default(false)
})
export type TAction = z.infer<typeof actionSchema>

export const appStateSchema = z.object({
	selectedInvoiceId: z.string().optional(),
	selectedItemId: z.string().optional(),
	selectedAddressId: z.string().optional(),
	drawerVisible: z.boolean().default(false),
	selectionMode: z.boolean().default(false),
	actions: actionSchema.or(z.literal('spacer')).array().default(Array)
})
export type TAppState = z.infer<typeof appStateSchema>
export const appState = writable<TAppState>(appStateSchema.parse({}))

export const userStateSchema = z.object({
	invoices: invoiceSchema.array().default(Array),
	archivedInvoices: invoiceSchema.array().default(Array),
	addressbook: entitySchema.array().default(Array),
	defaultSender: z.string().optional(),
	offlineMode: z.boolean().default(false),
	defaultCurrency: z.string().optional()
})
export type TUserState = z.infer<typeof userStateSchema>
export const userState = persisted<TUserState>('user-state-v1', userStateSchema.parse({}), {
	serializer: {
		parse(value) {
			return userStateSchema.parse(JSON.parse(value))
		},
		stringify(object) {
			return JSON.stringify(userStateSchema.parse(object))
		}
	}
})

export function loadingStore(navigating: Readable<any>) {
	const store = writable<boolean>(false)
	navigating.subscribe(() => {})

	const { subscribe } = derived<[typeof navigating, typeof store], boolean>(
		[navigating, store],
		([$navigating, $store]) => $store || $navigating
	)
	return {
		set: (value: boolean) => store.set(value),
		update: (value: (prev: boolean) => boolean) => store.update(value),
		subscribe
	}
}
