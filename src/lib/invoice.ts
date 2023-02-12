import { toast } from '$/components/base/Toast.svelte'
import { alert } from '$/modals/AlertModal.svelte'
import { offlineMode, userState, userStateSchema } from '$/stores'
import { invoiceItemLogSchema, invoiceSchema } from '$/types'
import { z } from 'zod'

const fetcher = createFetcher(fetch)

export const createInvoice = updateData({
	offlineCallback(invoice: TInvoice) {
		try {
			return {
				success: true,
				data: { ...invoice, id: genId(get(userState).invoices.map(({ id }) => id)) }
			}
		} catch {
			return {
				success: false,
				error: {
					code: 'ERROR_OFFLINE_CALLBACK',
					message: 'Offline callback error'
				}
			}
		}
	},
	async onlineCallback(invoice: TInvoice) {
		return await fetcher(invoiceSchema, '/api/v1/private/invoices', {
			method: 'POST',
			body: buildFormData(invoice)
		})
	},
	updateCallback(invoice: TInvoice) {
		userState.update(($userState) => {
			const { invoices } = $userState
			invoices.push(invoice)
			return $userState
		})
		return {
			success: true,
			data: invoice
		}
	}
})

export const editInvoice = updateData({
	offlineCallback(invoice: TInvoice) {
		return {
			success: true,
			data: invoice
		}
	},

	async onlineCallback(invoice: TInvoice) {
		return await fetcher(invoiceSchema, '/api/v1/private/invoices/' + invoice.id, {
			method: 'PUT',
			body: buildFormData(invoice)
		})
	},
	updateCallback(invoice: TInvoice) {
		userState.update(($userState) => {
			const { invoices } = $userState
			const _invoice = invoices.find((_invoice) => invoice.id === _invoice.id)
			if (_invoice) {
				Object.assign(_invoice, invoice)
			}
			return $userState
		})
		return {
			success: true,
			data: invoice
		}
	}
})

export const removeInvoice = updateData({
	offlineCallback(ids: TInvoice['id'][]) {
		return {
			success: true,
			data: ids
		}
	},
	async onlineCallback(ids: TInvoice['id'][]) {
		const result = await fetcher(
			z.object({ count: z.number() }),
			`/api/v1/private/invoices/${ids.join(',')}`,
			{
				method: 'DELETE'
			}
		)
		if (!result.success) result
		return {
			success: true,
			data: ids
		}
	},
	updateCallback(ids: TInvoice['id'][]) {
		userState.update(($userState) => {
			const { invoices } = $userState
			if (ids.length === 1) {
				const id = ids[0]
				removeInPlace(invoices, (invoice) => invoice.id === id)
			} else {
				filterInPlace(invoices, (invoice) => !ids.includes(invoice.id))
			}
			return $userState
		})
		return {
			success: true,
			data: {}
		}
	}
})

export const removeLogs = updateData({
	offlineCallback(invoiceId: TInvoice['id'], ids: TInvoiceItemLog['id'][]) {
		return {
			success: true,
			data: {
				invoiceId,
				ids
			}
		}
	},
	async onlineCallback(invoiceId: TInvoice['id'], ids: TInvoiceItemLog['id'][]) {
		const result = await fetcher(
			invoiceItemLogSchema,
			`/api/v1/private/invoices/${invoiceId}/logs/${ids.join(',')}`,
			{ method: 'DELETE' }
		)
		if (!result.success) return result
		return {
			success: true,
			data: {
				invoiceId,
				ids
			}
		}
	},
	updateCallback({ invoiceId, ids }) {
		userState.update(($userState) => {
			const { invoices } = $userState
			const invoice = invoices.find(({ id }) => id === invoiceId)
			if (!invoice) return $userState
			if (ids.length === 1) {
				const id = ids[0]
				removeInPlace(invoice.logs, (item) => item.id === id)
			} else {
				filterInPlace(invoice.logs, (item) => !ids.includes(item.id))
			}
			return $userState
		})
		return {
			success: true,
			data: {}
		}
	}
})

export const addLogs = updateData({
	offlineCallback(invoiceId: TInvoice['id'], log: TInvoiceItemLog) {
		return {
			success: true,
			data: {
				invoiceId,
				log
			}
		}
	},
	async onlineCallback(invoiceId: TInvoice['id'], log: TInvoiceItemLog) {
		const result = await fetcher(
			invoiceItemLogSchema,
			`/api/v1/private/invoices/${invoiceId}/logs`,
			{
				method: 'POST',
				body: buildFormData(log)
			}
		)
		if (!result.success) return result
		return {
			success: true,
			data: {
				invoiceId,
				log
			}
		}
	},
	updateCallback({ invoiceId, log }) {
		userState.update(($userState) => {
			const { invoices } = $userState
			const invoice = invoices.find(({ id }) => id === invoiceId)
			if (invoice) {
				invoice.logs.push(log)
			}
			return $userState
		})
		return {
			success: true,
			data: log
		}
	}
})

export const editLog = updateData({
	offlineCallback(invoiceId: TInvoiceItemLog['id'], log: TInvoiceItemLog) {
		return {
			success: true,
			data: {
				invoiceId,
				log
			}
		}
	},
	async onlineCallback(invoiceId: TInvoiceItemLog['id'], log: TInvoiceItemLog) {
		const result = await fetcher(
			invoiceItemLogSchema,
			`/api/v1/private/invoices/${invoiceId}/logs/${log.id}`,
			{
				method: 'PUT',
				body: buildFormData(log)
			}
		)
		if (!result.success) return result
		return {
			success: true,
			data: {
				invoiceId,
				log
			}
		}
	},
	updateCallback({ invoiceId, log }) {
		userState.update(($userState) => {
			const { invoices } = $userState
			const invoice = invoices.find(({ id }) => id === invoiceId)
			if (!invoice) return $userState
			Object.assign(invoice.logs.find(({ id }) => id === log.id) || {}, log)
			return $userState
		})
		return {
			success: true,
			data: log
		}
	}
})

export async function exportAll(filename: string = 'justinvoices') {
	const $offlineMode = get(offlineMode)
	if (!$offlineMode) {
		const result = await fetcher(
			userStateSchema.pick({ invoices: true, addressbook: true }),
			'/api/v1/private/invoices?' + buildQueryString({ includeLogs: true, archived: null })
		)
		if (!result.success) {
			toast(result.error.code, result.error.message, { type: 'error', duration: 5000 })
			throw new Error(`${result.error.code}: ${result.error.message}`)
		}
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
		const result = await fetcher(z.object({}), '/api/v1/private/import', {
			method: 'POST',
			body: buildFormData(importedData)
		})
		if (!result.success) {
			toast(result.error.code, result.error.message, { type: 'error', duration: 5000 })
			throw new Error(`${result.error.code}: ${result.error.message}`)
		}
	}

	userState.update((val) => {
		const { invoices, addressbook } = val

		invoices.push(...uniqByKey(diffByKey(importedData.invoices, invoices, 'id'), 'id'))
		addressbook.push(...uniqByKey(diffByKey(importedData.addressbook, addressbook, 'id'), 'id'))

		return val
	})
}
