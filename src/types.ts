import { z } from 'zod'

const HTTP_STATUS_CODES = [
	100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305,
	307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416,
	417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506,
	507, 508, 510, 511
] satisfies Array<number>
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

export function resultSchema<TData extends z.ZodTypeAny, U extends z.infer<TData>>(
	dataSchema: TData
) {
	const schema = z.discriminatedUnion('success', [
		z.object({
			success: z.literal(true),
			data: dataSchema
		}),
		z.object({
			success: z.literal(false),
			error: z.object({
				code: z.string().regex(/^[A-Z_]+$/),
				message: z.string()
			})
		})
	])
	return {
		...schema,
		parse: schema.parse as (...args: Parameters<typeof schema.parse>) => TResult<U>
	}
}

export function fetchSchema<TData extends z.ZodTypeAny, U extends z.infer<TData>>(
	dataSchema: TData
) {
	const schema = z.discriminatedUnion('success', [
		z.object({
			success: z.literal(true),
			data: dataSchema
		}),
		z.object({
			success: z.literal(false),
			error: z.object({
				statusCode: z
					.number()
					.refine((val) => HTTP_STATUS_CODES.includes(val), {
						message: 'Status code must be one of ' + HTTP_STATUS_CODES.join(', ')
					}),
				code: z.number(),
				message: z.string()
			})
		})
	])
	return {
		...schema,
		parse: schema.parse as (...args: Parameters<typeof schema.parse>) => TFetch<U>
	}
}

declare global {
	type TInvoiceItemType = ArrayValues<typeof InvoiceItemType>
	type ArrayValues<T extends Readonly<Array<any>>> = T[number]
	type TSession = z.infer<typeof sessionSchema>
	type TEntity = z.infer<typeof entitySchema>
	type TResult<T> =
		| {
				readonly success: true
				data: T
		  }
		| {
				readonly success: false
				readonly error: {
					readonly code: string
					readonly message: string
				}
		  }
	type TFetch<T> =
		| {
				readonly success: true
				readonly statusCode: number
				data: T
		  }
		| {
				readonly success: false
				readonly statusCode: number
				readonly error: {
					readonly code: string
					readonly message: string
				}
		  }
	type TInvoiceItemLog = z.infer<typeof invoiceItemLogSchema>
	type TInvoice = z.infer<typeof invoiceSchema>
	type MaybePromise<T> = Promise<T> | T
}
