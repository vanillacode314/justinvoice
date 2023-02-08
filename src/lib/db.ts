import { resultSchema } from '$/types'
import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import z from 'zod'

export const db = new PrismaClient()
export async function handleTransaction<TReturnType, TResultSchema = TResult<TReturnType>>(
	transaction: () => Promise<TReturnType>
): Promise<TResultSchema> {
	try {
		const result = await transaction()
		return resultSchema(z.any()).parse({
			success: true,
			data: result
		}) as TResultSchema
	} catch (error) {
		console.error(error)
		return resultSchema(z.any()).parse({
			success: false,
			error: {
				code: 'DATABASE_ERROR',
				message: 'Database error'
			}
		}) as TResultSchema
	}
}

export const dbDateSchema = z.date().transform((date) => date.getTime())
export const dbDecimalSchema = z.instanceof(Decimal).transform((date) => +date.valueOf())
