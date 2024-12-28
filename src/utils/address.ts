import { userState } from '$/stores'
import type { TEntity } from '$/types'
import { nanoid } from 'nanoid'

export function addAddress(name: TEntity['name'], address: TEntity['address']): TEntity {
	const id: TEntity['id'] = nanoid()
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
}

export const removeAddresses = (ids: TEntity['id'][]) => {
	if (ids.length === 0) return
	userState.update((val) => {
		const { invoices, addressbook } = val
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
		return val
	})
}
