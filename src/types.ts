import { z } from 'zod'

export const sessionSchema = z.object({
	expired: z.boolean(),
	user: z.bigint().nullable()
})

export const entitySchema = z.object({
	id: z.bigint().default(-1n),
	name: z.string().trim().default(''),
	address: z.string().trim().default(''),
	notes: z.string().trim().default('')
})

export const InvoiceItemType = ['GOODS', 'SERVICES'] as const
export const invoiceItemLogSchema = z.object({
	id: z.bigint().default(-1n),
	title: z.string().trim().default(''),
	description: z.string().trim().default(''),
	type: z.enum(InvoiceItemType).default('GOODS'),
	qty: z
		.number()
		.min(1, {
			message: 'Quantity must be greater than or equal to 1'
		})
		.default(1),
	cost: z
		.number()
		.min(0, {
			message: 'Cost must be greater than or equal to 0'
		})
		.default(0)
})

export const invoiceSchema = z.object({
	id: z.bigint().default(-1n),
	title: z.string().trim().default(''),
	paid: z.boolean().default(false),
	dateOfIssue: z.number().default(Date.now),
	currency: z.string().default('USD'),
	senderId: z.bigint().default(-1n),
	recipientId: z.bigint().default(-1n),
	archived: z.boolean().default(false),
	logs: invoiceItemLogSchema.array().default(Array),
	notes: z.string().trim().default('')
})

export function resultSchema<TData extends z.ZodTypeAny>(dataSchema: TData) {
	return z.discriminatedUnion('success', [
		z.object({
			success: z.literal(true),
			data: dataSchema
		}),
		z.object({
			success: z.literal(false),
			error: z.object({
				code: z.string(),
				message: z.any()
			})
		})
	])
}

declare global {
	type TInvoiceItemType = ArrayValues<typeof InvoiceItemType>
	type ArrayValues<T extends Readonly<Array<any>>> = T[number]
	type TSession = z.infer<typeof sessionSchema>
	type TEntity = z.infer<typeof entitySchema>
	type TResult<T> = z.infer<ReturnType<typeof resultSchema<z.ZodType<T>>>>
	type TInvoiceItemLog = z.infer<typeof invoiceItemLogSchema>
	type TInvoice = z.infer<typeof invoiceSchema>
}
