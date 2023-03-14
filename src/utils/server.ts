import { resultSchema } from '$/types'
import type { RequestHandler } from '@sveltejs/kit'
import * as devalue from 'devalue'
import z from 'zod'

type TParams = Parameters<RequestHandler>[0]
interface Opts {
	statusCode: number
}
type TSend<T> = (result: TResult<T>, opts?: Partial<Opts>) => Response
type THandler<TInput, TOutput> = (
	params: TParams & { send: TSend<TOutput>; data: TInput }
) => Promise<Response>
export function makeResultHandler<
	TInputSchema extends z.ZodTypeAny,
	TOutputSchema extends z.ZodTypeAny
>(
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	inputSchema: TInputSchema,
	outputSchema: TOutputSchema,
	handler: THandler<z.infer<TInputSchema>, z.input<TOutputSchema>>
): RequestHandler {
	const send = (
		result: TResult<z.input<TOutputSchema>>,
		{ statusCode = 200 }: Partial<Opts> = {}
	) => {
		return new Response(devalue.stringify(resultSchema(outputSchema).parse(result)), {
			status: statusCode
		})
	}

	return async (params) => {
		if (inputSchema instanceof z.ZodNull) return await handler({ ...params, send, data: null })
		const data =
			method === 'GET'
				? await handleQueries(inputSchema, params.url.searchParams)
				: await handleFormData(inputSchema, await params.request.formData())
		if (data === null) {
			return send(
				{
					success: false,
					error: {
						code: method === 'GET' ? 'INVALID_QUERY' : 'INVALID_FORM_DATA',
						message: method === 'GET' ? 'Invalid query string' : 'Invalid form data'
					}
				},
				{ statusCode: 400 }
			)
		}
		return await handler({ ...params, send, data: data })
	}
}

export function handleFormData<T extends z.ZodTypeAny>(
	dataSchema: T,
	formData: FormData
): Promise<z.infer<T> | null> {
	const value = formData.get('value') as string
	const result = dataSchema.safeParse(devalue.parse(value) || {})
	return result.success ? result.data : null
}

export function handleQueries<T extends z.ZodTypeAny>(
	dataSchema: T,
	query: URLSearchParams
): Promise<z.infer<T> | null> {
	const value = query.get('value') as string
	const result = dataSchema.safeParse(devalue.parse(value) || {})
	return result.success ? result.data : null
}
