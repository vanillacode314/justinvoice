import { entitySchema, invoiceSchema } from '$/types'
import { z } from 'zod'

export const actionSchema = z.object({
	icon: z.string(),
	color: z.string().default('').optional(),
	label: z.string(),
	action: z.function(z.tuple([]), z.void()),
	noClose: z.boolean().default(false).optional(),
	noFab: z.boolean().default(false).optional()
})

export type TAction = z.infer<typeof actionSchema>

export const appStateSchema = z.object({
	selectedInvoiceId: z.string().optional(),
	selectedItemId: z.string().optional(),
	selectedAddressId: z.string().optional(),
	drawerVisible: z.boolean().default(false),
	actions: z.array(actionSchema.or(z.literal('spacer'))).default(() => [])
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
