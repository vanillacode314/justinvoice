import { offlineMode, userState } from '$/stores'
import { entitySchema, resultSchema } from '$/types'
import { createZodFetcher } from 'zod-fetch'

const fetcher = createZodFetcher()

export async function addAddress(
	name: TEntity['name'],
	address: TEntity['address']
): Promise<TEntity> {
	const $offlineMode = get(offlineMode)
	let entity: TEntity
	if ($offlineMode) {
		const id = genId(get(userState).addressbook.map(({ id }) => id))
		entity = {
			id,
			name,
			address
		}
	} else {
		const result = await fetcher(resultSchema(entitySchema), '/api/v1/private/entities', {
			method: 'POST',
			body: buildFormData({
				name,
				address
			})
		})
		if (!result.success) throw new Error(result.error.message)
		entity = result.data
	}

	userState.update(($userState) => {
		const { addressbook } = $userState
		addressbook.push(entity)
		return $userState
	})
	return entity
}

export async function editAddress(
	id: TEntity['id'],
	name: TEntity['name'],
	address: TEntity['address']
): Promise<TEntity> {
	const $offlineMode = get(offlineMode)
	let entity: TEntity
	if ($offlineMode) {
		entity = {
			id,
			name,
			address
		}
	} else {
		const result = await fetcher(resultSchema(entitySchema), `/api/v1/private/entities/${id}`, {
			method: 'PUT',
			body: buildFormData({
				name,
				address
			})
		})
		if (!result.success) throw new Error(result.error.message)
		entity = result.data
	}

	userState.update(($userState) => {
		const { addressbook } = $userState
		const _entity = addressbook.find((entity) => entity.id === id)!
		if (_entity) {
			Object.assign(_entity, entity)
		}
		return $userState
	})
	return entity
}

export async function removeAddresses(ids: TEntity['id'][]) {
	if (ids.length === 0) return
	const $offlineMode = get(offlineMode)
	if (!$offlineMode) {
		const result = await fetcher(
			resultSchema(z.object({ count: z.number() })),
			`/api/v1/private/entities/${ids.join(',')}`,
			{
				method: 'DELETE'
			}
		)
		if (!result.success) throw new Error(result.error.message)
	}
	userState.update(($userState) => {
		const { invoices, addressbook } = $userState
		if (ids.length === 1) {
			const id = ids[0]
			filterInPlace(invoices, ({ senderId, recipientId }) => id !== senderId && id !== recipientId)
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
}
