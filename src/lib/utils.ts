import { offlineMode } from '$/stores'
import { resultSchema } from '$/types'
import z, { ZodError } from 'zod'

type TCallback<TArgs extends Array<unknown>, TReturnType> = (...args: TArgs) => TReturnType
type TMaybePromiseResultCallback<TArgs extends Array<unknown>, TReturnType> = TCallback<
	TArgs,
	MaybePromise<TResult<TReturnType>>
>

interface IParams<TArgs extends Array<unknown>, TData, TReturnType> {
	offlineCallback: TMaybePromiseResultCallback<TArgs, TData>
	onlineCallback: TMaybePromiseResultCallback<TArgs, TData>
	updateCallback: TMaybePromiseResultCallback<[TData], TReturnType>
}

interface IOptions<T extends z.ZodTypeAny> {
	schema: T
}
export function updateData<
	TArgs extends Array<unknown>,
	TData,
	TSchema extends z.ZodTypeAny,
	TReturnType extends z.input<TSchema>
>(
	callbacks: IParams<TArgs, TData, TReturnType>,
	{ schema }: Partial<IOptions<TSchema>> = {}
): TCallback<TArgs, Promise<TResult<TReturnType>>> {
	const _schema: TSchema = schema || (z.any() as any)
	return async (...args) => {
		try {
			const result = get(offlineMode)
				? await callbacks.offlineCallback(...args)
				: await callbacks.onlineCallback(...args)
			if (!result.success) return result
			const result2 = await callbacks.updateCallback(result.data)
			return resultSchema(_schema).parse(result2)
		} catch (error) {
			if (error instanceof ZodError) {
				return resultSchema().parse({
					success: false,
					error: {
						code: 'DATA_VALIDATION_FAILED',
						message: error.errors.map((e) => e.message).join(', ')
					}
				})
			}
			console.error(error)
			return resultSchema().parse({
				success: false,
				error: {
					code: 'UPDATE_DATA_ERROR',
					message: 'An error occurred while updating data'
				}
			})
		}
	}
}
