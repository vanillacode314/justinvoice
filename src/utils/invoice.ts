import { alert } from '$/modals/AlertModal.svelte'
import { userState, userStateSchema } from '$/stores'
import {
	invoiceItemLogSchema,
	invoiceSchema,
	resultSchema,
	type TEntity,
	type TInvoice,
	type TInvoiceItemLog
} from '$/types'
import type { z } from 'zod'
import { diffByKey } from '.'

export async function createInvoice(
	title: TInvoice['title'],
	senderId: TEntity['id'],
	recipientId: TEntity['id'],
	currency: TInvoice['currency']
): Promise<Pick<TInvoice, 'id'>> {
	const schema = invoiceSchema.pick({ id: true })
	const { offlineMode } = get(userState)

	if (offlineMode) {
		let id: TInvoice['id'] = crypto.randomUUID()
		const ids = get(userState).invoices.map(({ id }) => id)
		while (ids.includes(id)) {
			id = crypto.randomUUID()
		}
		const invoice: TInvoice = invoiceSchema.parse({
			id,
			title,
			senderId,
			recipientId,
			currency
		})
		userState.update((val) => {
			const { invoices } = val
			invoices.push(invoice)
			return val
		})
		return schema.parse(invoice)
	} else {
		const result = await fetch('/api/invoice', {
			method: 'POST',
			body: getFormData({
				title,
				senderId: +senderId,
				recipientId: +recipientId,
				currency
			})
		})
			.catch((err) => {
				throw new Error(err)
			})
			.then(async (res) => resultSchema(schema).parse(await res.json()))

		if (!result.success) {
			throw new Error(JSON.stringify(result.error))
		}

		return schema.parse(result.data)
	}
}

export async function removeInvoice(id: TInvoice['id']) {
	const { offlineMode } = get(userState)
	if (offlineMode) {
		userState.update((val) => {
			const { invoices } = val
			removeInPlace(invoices, (invoice) => invoice.id === id)
			return val
		})
	} else {
		const result = await fetch('/api/invoice', {
			method: 'DELETE',
			body: getFormData({
				ids: [id]
			})
		}).catch((err) => {
			throw new Error(err)
		})
	}
}

export const removeItems = (invoiceId: TInvoice['id'], ids: TInvoiceItemLog['id'][]) => {
	if (ids.length === 0) return
	userState.update((val) => {
		const { invoices } = val
		const invoice = invoices.find(({ id }) => id === invoiceId)
		if (!invoice) return val
		if (ids.length === 1) {
			const id = ids[0]
			removeInPlace(invoice.logs, (item) => item.id === id)
		} else {
			filterInPlace(invoice.logs, (item) => !ids.includes(item.id))
		}
		return val
	})
}

export function addItem(
	invoiceId: TInvoice['id'],
	title: TInvoiceItemLog['title'],
	type: TInvoiceItemLog['type'],
	cost: TInvoiceItemLog['cost'],
	qty: TInvoiceItemLog['qty'],
	description: TInvoiceItemLog['description'] = ''
) {
	const id = crypto.randomUUID()
	const log: TInvoiceItemLog = invoiceItemLogSchema.parse({
		id,
		title,
		type,
		cost,
		description,
		qty
	})
	userState.update((val) => {
		const { invoices } = val
		const invoice = invoices.find(({ id }) => id === invoiceId)
		if (invoice) {
			invoice.logs.push(log)
		}
		return val
	})
	return log
}

export function exportAll(filename: string = 'justinvoices') {
	const dateString = new Date().toLocaleString(undefined, {
		dateStyle: 'short',
		timeStyle: 'short',
		hour12: false
	})
	exportToJsonFile(
		userStateSchema
			.pick({
				invoices: true,
				archivedInvoices: true,
				addressbook: true
			})
			.parse(get(userState)),
		`${filename}-${dateString}.json`
	)
}

export async function importInvoices() {
	const content = await getFile('application/json')
	if (!content) {
		alert({
			title: 'No File Selected',
			icon: 'i-mdi-warning',

			message: 'Please select a valid invoice file'
		})
		return
	}

	const schema = userStateSchema.pick({
		invoices: true,
		archivedInvoices: true,
		addressbook: true
	})

	let result = safeParseJson<z.infer<typeof schema>>(content)
	if (!result.success) {
		alert({
			title: 'Invalid File',
			icon: 'i-mdi-warning',
			message: 'Please select a valid invoice file'
		})
		return
	}

	result = schema.safeParse(result.data)
	if (!result.success) {
		alert({
			title: 'Invalid File',
			icon: 'i-mdi-warning',
			message: 'Please select a valid invoice file'
		})
		return
	}

	const importedData = result.data

	userState.update((val) => {
		const { archivedInvoices, invoices, addressbook } = val

		invoices.push(...uniqByKey(diffByKey(importedData.invoices, invoices, 'id'), 'id'))
		archivedInvoices.push(
			...uniqByKey(diffByKey(importedData.archivedInvoices, archivedInvoices, 'id'), 'id')
		)
		addressbook.push(...uniqByKey(diffByKey(importedData.addressbook, addressbook, 'id'), 'id'))

		return val
	})
}
