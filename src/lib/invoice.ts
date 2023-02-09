import { alert } from '$/modals/AlertModal.svelte'
import { offlineMode, userState, userStateSchema } from '$/stores'
import { invoiceItemLogSchema, invoiceSchema, resultSchema } from '$/types'
import { z } from 'zod'

const fetcher = createFetcher(fetch)

export async function createInvoice(invoice: TInvoice): Promise<TInvoice> {
	let newInvoice: TInvoice
	const $offlineMode = get(offlineMode)

	if ($offlineMode) {
		const id = genId(get(userState).invoices.map(({ id }) => id))
		newInvoice = { ...invoice, id }
	} else {
		const result = await fetcher(resultSchema(invoiceSchema), '/api/v1/private/invoices', {
			method: 'POST',
			body: buildFormData(invoice)
		})

		if (!result.success) throw new Error(JSON.stringify(result.error))
		newInvoice = result.data
	}

	userState.update(($userState) => {
		const { invoices } = $userState
		invoices.push(newInvoice)
		return $userState
	})
	return newInvoice
}

export async function editInvoice(invoice: TInvoice): Promise<TInvoice> {
	let newInvoice: TInvoice
	const $offlineMode = get(offlineMode)

	if ($offlineMode) {
		newInvoice = invoice
	} else {
		const result = await fetcher(
			resultSchema(invoiceSchema),
			'/api/v1/private/invoices/' + invoice.id,
			{
				method: 'PUT',
				body: buildFormData(invoice)
			}
		)

		if (!result.success) throw new Error(JSON.stringify(result.error))
		newInvoice = result.data
	}

	userState.update(($userState) => {
		const { invoices } = $userState
		const _invoice = invoices.find((_invoice) => invoice.id === _invoice.id)
		if (_invoice) {
			Object.assign(_invoice, newInvoice)
		}
		return $userState
	})
	return newInvoice
}

export async function removeInvoice(id: TInvoice['id']) {
	const $offlineMode = get(offlineMode)
	if (!$offlineMode) {
		await fetcher(resultSchema(z.object({ count: z.number() })), `/api/v1/private/invoices/${id}`, {
			method: 'DELETE'
		})
	}

	userState.update(($userState) => {
		const { invoices } = $userState
		removeInPlace(invoices, (invoice) => invoice.id === id)
		return $userState
	})
}

export async function removeLogs(invoiceId: TInvoice['id'], ids: TInvoiceItemLog['id'][]) {
	if (ids.length === 0) return
	const $offlineMode = get(offlineMode)
	if (!$offlineMode) {
		await fetcher(
			resultSchema(invoiceItemLogSchema),
			`/api/v1/private/invoices/${invoiceId}/logs/${ids.join(',')}`,
			{ method: 'DELETE' }
		)
	}

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

export async function addLog(
	invoiceId: TInvoice['id'],
	title: TInvoiceItemLog['title'],
	type: TInvoiceItemLog['type'],
	cost: TInvoiceItemLog['cost'],
	qty: TInvoiceItemLog['qty'],
	description: TInvoiceItemLog['description'] = ''
) {
	const $offlineMode = get(offlineMode)
	let log: TInvoiceItemLog
	if ($offlineMode) {
		const id = crypto.randomUUID()
		log = invoiceItemLogSchema.parse({
			id,
			title,
			type,
			cost,
			description,
			qty
		})
	} else {
		const result = await fetcher(
			resultSchema(invoiceItemLogSchema),
			`/api/v1/private/invoices/${invoiceId}/logs`,
			{
				method: 'POST',
				body: buildFormData({
					title,
					type,
					cost,
					qty,
					description
				})
			}
		)

		if (!result.success) throw new Error(JSON.stringify(result.error))
		log = result.data
	}
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
export async function editLog(
	invoiceId: TInvoice['id'],
	logId: TInvoiceItemLog['id'],
	title: TInvoiceItemLog['title'],
	type: TInvoiceItemLog['type'],
	cost: TInvoiceItemLog['cost'],
	qty: TInvoiceItemLog['qty'],
	description: TInvoiceItemLog['description'] = ''
) {
	const $offlineMode = get(offlineMode)
	let log: TInvoiceItemLog
	if ($offlineMode) {
		log = invoiceItemLogSchema.parse({
			id: logId,
			title,
			type,
			cost,
			description,
			qty
		})
	} else {
		const result = await fetcher(
			resultSchema(invoiceItemLogSchema),
			`/api/v1/private/invoices/${invoiceId}/logs/${logId}`,
			{
				method: 'PUT',
				body: buildFormData({
					title,
					type,
					cost,
					qty,
					description
				})
			}
		)

		if (!result.success) throw new Error(JSON.stringify(result.error))
		log = result.data
	}
	userState.update(($userState) => {
		const { invoices } = $userState
		const invoice = invoices.find(({ id }) => id === invoiceId)
		if (!invoice) return $userState
		Object.assign(invoice.logs.find(({ id }) => id === logId) || {}, log)
		return $userState
	})
	return log
}

export async function exportAll(filename: string = 'justinvoices') {
	const $offlineMode = get(offlineMode)
	if (!$offlineMode) {
		const result = await fetcher(
			resultSchema(userStateSchema.pick({ invoices: true, addressbook: true })),
			'/api/v1/private/invoices?' + buildQueryString({ includeLogs: true, archived: null })
		)
		if (!result.success) throw new Error(JSON.stringify(result.error))
		userState.update(($userState) => Object.assign($userState, result.data))
	}
	const dateString = new Date().toLocaleString(navigator.language, {
		dateStyle: 'short',
		timeStyle: 'short',
		hour12: false
	})
	exportToJsonFile(
		userStateSchema
			.pick({
				invoices: true,
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

	const $offlineMode = get(offlineMode)
	if (!$offlineMode) {
		const result = await fetcher(resultSchema(z.object({})), '/api/v1/private/import', {
			method: 'POST',
			body: buildFormData(importedData)
		})
		if (!result.success) throw new Error(JSON.stringify(result.error))
	}

	userState.update((val) => {
		const { invoices, addressbook } = val

		invoices.push(...uniqByKey(diffByKey(importedData.invoices, invoices, 'id'), 'id'))
		addressbook.push(...uniqByKey(diffByKey(importedData.addressbook, addressbook, 'id'), 'id'))

		return val
	})
}
