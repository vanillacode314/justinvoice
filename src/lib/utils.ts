import { offlineMode } from '$/stores'

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
export function updateData<TArgs extends Array<unknown>, TData, TReturnType>(
	callbacks: IParams<TArgs, TData, TReturnType>
): TCallback<TArgs, Promise<TResult<TReturnType>>> {
	return async (...args) => {
		try {
			const result = get(offlineMode)
				? await callbacks.offlineCallback(...args)
				: await callbacks.onlineCallback(...args)
			if (!result.success) return result
			return await callbacks.updateCallback(result.data)
		} catch {
			return {
				success: false,
				error: {
					code: 'UPDATE_DATA_ERROR',
					message: 'An error occurred while updating data'
				}
			}
		}
	}
}
