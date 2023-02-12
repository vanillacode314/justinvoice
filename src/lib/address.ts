import { userState } from '$/stores'
import { entitySchema } from '$/types'
const fetcher = createFetcher(fetch)

export const addAddress = updateData(
	{
		offlineCallback(entity: TEntity) {
			return {
				success: true,
				data: { ...entity, id: genId(get(userState).addressbook.map(({ id }) => id)) }
			}
		},
		async onlineCallback(entity: TEntity) {
			return await fetcher(entitySchema, '/api/v1/private/entities', {
				method: 'POST',
				body: buildFormData(entity)
			})
		},
		updateCallback(entity) {
			userState.update(($userState) => {
				const { addressbook } = $userState
				addressbook.push(entity)
				return $userState
			})
			return {
				success: true,
				data: entity
			}
		}
	},
	{
		schema: entitySchema.refine(({ id }) => id !== -1n, {
			message: 'Specify an id to create an address'
		})
	}
)

export const editAddress = updateData(
	{
		offlineCallback(entity: TEntity) {
			return {
				success: true,
				data: entity
			}
		},
		async onlineCallback(entity: TEntity) {
			return await fetcher(entitySchema, `/api/v1/private/entities/${entity.id}`, {
				method: 'PUT',
				body: buildFormData(entity)
			})
		},
		updateCallback(entity: TEntity) {
			userState.update(($userState) => {
				const { addressbook } = $userState
				const _entity = addressbook.find(({ id }) => entity.id === id)!
				if (_entity) {
					Object.assign(_entity, entity)
				}
				return $userState
			})
			return {
				success: true,
				data: entity
			}
		}
	},
	{ schema: entitySchema }
)

export const removeAddresses = updateData(
	{
		offlineCallback(ids: TEntity['id'][]) {
			return {
				success: true,
				data: {
					ids,
					count: ids.length
				}
			}
		},
		async onlineCallback(ids: TEntity['id'][]) {
			const result = await fetcher(
				z.object({ count: z.number() }),
				`/api/v1/private/entities/${ids.join(',')}`,
				{
					method: 'DELETE'
				}
			)
			if (!result.success) return result
			return {
				success: true,
				data: {
					ids,
					count: result.data.count
				}
			}
		},
		updateCallback({ ids, count }) {
			userState.update(($userState) => {
				const { invoices, addressbook } = $userState
				if (ids.length === 1) {
					const id = ids[0]
					filterInPlace(
						invoices,
						({ senderId, recipientId }) => id !== senderId && id !== recipientId
					)
					removeInPlace(addressbook, (address) => address.id === id)
				} else {
					filterInPlace(
						invoices,
						({ senderId, recipientId }) => !ids.some((id) => id === senderId || id === recipientId)
					)
					filterInPlace(addressbook, (address) => !ids.includes(address.id))
				}
				return $userState
			})
			return {
				success: true,
				data: { count }
			}
		}
	},
	{ schema: z.object({ count: z.number() }) }
)
