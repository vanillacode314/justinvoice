import { userState } from '$/stores'
import type { TEntity } from '$/types'

export function addAddress(name: TEntity['name'], address: TEntity['address']) {
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
}

export const removeAddress = (id: TEntity['id']) => {
	userState.update((val) => {
		const { invoices, addressbook } = val
		invoices.splice(
			0,
			invoices.length,
			...invoices.filter(({ senderId, recipientId }) => senderId !== id && recipientId !== id)
		)
		addressbook.splice(
			addressbook.findIndex((address) => address.id === id),
			1
		)
		return val
	})
}
