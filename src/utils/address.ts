import { addressbook } from '$stores/app';
import { getId } from '.';

export interface Address {
	id: number;
	name: string;
	address: string;
}

export function addAddress(name: Address['name'], address: Address['address']) {
	const p = {
		id: getId(),
		name,
		address
	};
	addressbook.update((val) => {
		val.push(p);
		return val;
	});
}

export function removeAddress(id: Address['id']) {
	addressbook.update((val) => val.filter((p) => p.id !== id));
}
