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
		logs: z.array(invoiceItemLogSchema).default(() => [])
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
export type TInvoice = z.infer<typeof invoiceSchema>
