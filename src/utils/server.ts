import { resultSchema, type TResult } from '$/types'
import type z from 'zod'

export function makeResultHandler<T extends z.ZodTypeAny>(dataSchema: T) {
	return (result: TResult<z.input<T>>, statusCode: number = 200) => {
		return new Response(JSON.stringify(resultSchema(dataSchema).parse(result)), {
			status: statusCode
		})
	}
}

export function handleFormData<T extends z.ZodTypeAny>(
	dataSchema: T,
	formData: FormData
): Promise<z.infer<T> | null> {
	const value = formData.get('value') as string
	const result = dataSchema.safeParse(JSON.parse(value))
	return result.success ? result.data : null
}
