import { userState } from '$/stores'
import { entitySchema, type TEntity } from '$/types'

export async function addAddress(
	name: TEntity['name'],
	address: TEntity['address']
): Promise<TEntity> {
	const { offlineMode } = get(userState)
	if (offlineMode) {
		let id: TEntity['id'] = crypto.randomUUID()
		const ids = get(userState).addressbook.map(({ id }) => id)
		while (ids.includes(id)) {
			id = crypto.randomUUID()
		}
		const entity = {
			id,
			name,
			address
		}
		userState.update((val) => {
			const { addressbook } = val
			addressbook.push(entity)
			return val
		})

		return entity
	} else {
		const entity = await fetch('/api/entity', {
			method: 'POST',
			body: getFormData({
				name,
				address
			})
		})
			.then(async (res) => entitySchema.parse(await res.json()))
			.catch((err) => {
				throw new Error(err)
			})
		return entity
	}
}

export async function removeAddresses(ids: TEntity['id'][]) {
	if (ids.length === 0) return
	const { offlineMode } = get(userState)
	if (offlineMode) {
		userState.update((val) => {
			const { invoices, addressbook } = val
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
			return val
		})
	} else {
		await fetch('/api/entity', {
			method: 'DELETE',
			body: getFormData({
				ids
			})
		}).catch((err) => {
			throw new Error(err)
		})
	}
}
