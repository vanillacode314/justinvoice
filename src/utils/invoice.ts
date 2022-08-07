import { invoices } from '$stores/app';
import { getId } from '$utils';
import type { Address } from '$utils/address';

export type INVOICE_ITEM_TYPE = 0 | 1;
export const SERVICE: INVOICE_ITEM_TYPE = 0;
export const GOODS: INVOICE_ITEM_TYPE = 1;

type Timestamp = number;

export interface Item {
	id: number;
	title: string;
	description: string;
	type: INVOICE_ITEM_TYPE;
	qty: number;
	price: number;
	currency: string;
}

export interface Invoice {
	id: number;
	title: string;
	paid: boolean;
	date_of_issue: Timestamp;
	senderID: Address['id'];
	recipientID: Address['id'];
	// Legacy values
	sender?: Address;
	recipient?: Address;
	items: Item[];
}

export function createInvoice(
	title: Invoice['title'],
	sender: Address,
	recipient: Address
): Invoice {
	const id: Invoice['id'] = getId();
	const invoice: Invoice = {
		id,
		title,
		paid: false,
		date_of_issue: Date.now(),
		senderID: sender.id,
		recipientID: recipient.id,
		items: []
	};
	invoices.update((val) => {
		val.push(invoice);
		return val;
	});
	return invoice;
}

export function removeInvoice(id: Invoice['id']) {
	invoices.update((val) => {
		return val.filter((invoice) => invoice.id != id);
	});
}

export function addItem(
	invoiceId: Invoice['id'],
	title: Item['title'],
	type: Item['type'],
	price: Item['price'],
	currency: Item['currency'],
	qty: Item['qty'],
	description: Item['description'] = ''
) {
	const id: Item['id'] = getId();
	const item: Item = {
		id,
		title,
		description,
		type,
		qty,
		price,
		currency
	};
	invoices.update((val) => {
		const invoice = val.find((i) => i.id === invoiceId);
		invoice!.items.push(item);
		return val;
	});
	return item;
}
