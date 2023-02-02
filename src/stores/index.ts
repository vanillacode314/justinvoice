import { entitySchema, invoiceSchema } from '$/types'
import { persisted } from 'svelte-local-storage-store'
import { z } from 'zod'

export const appStateSchema = z.object({
	selectedInvoiceId: z.string().optional(),
	selectedItemId: z.string().optional(),
	selectedAddressId: z.string().optional(),
	drawerVisible: z.boolean().default(false)
})
export type TAppState = z.infer<typeof appStateSchema>
export const appState = writable<TAppState>(appStateSchema.parse({}))

export const userStateSchema = z.object({
	invoices: z.array(invoiceSchema).default(Array),
	archivedInvoices: z.array(invoiceSchema).default(Array),
	addressbook: z.array(entitySchema).default(Array),
	defaultSender: z.string().optional(),
	defaultCurrency: z.string().optional()
})
export type TUserState = z.infer<typeof userStateSchema>
export const userState = persisted<TUserState>('user-state-v1', userStateSchema.parse({}))
