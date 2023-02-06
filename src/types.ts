import { z } from 'zod'

export const InvoiceItemType = ['GOODS', 'SERVICES'] as const
type ArrayValues<T extends Readonly<Array<any>>> = T[number]
export type TInvoiceItemType = ArrayValues<typeof InvoiceItemType>

export const entitySchema = z.object({
	id: z.string().default(''),
	name: z.string().default(''),
	address: z.string().default('')
})
export type TEntity = z.infer<typeof entitySchema>

export const invoiceItemLogSchema = z.object({
	id: z.string().default(''),
	title: z.string().default(''),
	description: z.string().default(''),
	type: z.enum(InvoiceItemType).default('GOODS'),
	qty: z.number().min(1).default(1),
	cost: z.number().default(0)
})
export type TInvoiceItemLog = z.infer<typeof invoiceItemLogSchema>

export const invoiceSchema = z
	.object({
		id: z.string().default(''),
		title: z.string().default(''),
		paid: z.boolean().default(false),
		dateOfIssue: z.number().default(() => Date.now()),
		currency: z.string().default('USD'),
		senderId: z.string().default(''),
		recipientId: z.string().default(''),
		logs: invoiceItemLogSchema.array().default(Array)
	})
	.refine(
		(val) => {
			if (val.senderId === '' || val.recipientId === '') return true
			return val.senderId !== val.recipientId
		},
		{
			message: 'Sender and Recipient should not be the same'
		}
	)
	.innerType()
export type TInvoice = z.infer<typeof invoiceSchema>

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
export type TResult<T> = z.infer<ReturnType<typeof resultSchema<z.ZodType<T>>>>
