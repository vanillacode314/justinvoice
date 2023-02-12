import { toast } from '$/components/base/Toast.svelte'
import { alert } from '$/modals/AlertModal.svelte'
import { userState } from '$/stores'
import { invoiceItemLogSchema } from '$/types'
import { z } from 'zod'

const fetcher = createFetcher(fetch)
export const removeLogs = updateData(
	{
		offlineCallback(invoiceId: TInvoice['id'], ids: TInvoiceItemLog['id'][]) {
			return {
				success: true,
				data: {
					invoiceId,
					ids,
					count: ids.length
				}
			}
		},
		async onlineCallback(invoiceId: TInvoice['id'], ids: TInvoiceItemLog['id'][]) {
			const result = await fetcher(
				z.object({ count: z.number() }),
				`/api/v1/private/invoices/${invoiceId}/logs/${ids.join(',')}`,
				{ method: 'DELETE' }
			)
			if (!result.success) return result
			return {
				success: true,
				data: {
					invoiceId,
					ids,
					count: result.data.count
				}
			}
		},
		updateCallback({ count, invoiceId, ids }) {
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
				data: {
					count
				}
			}
		}
	},
	{
		schema: z.object({ count: z.number() })
	}
)

export const addLogs = updateData(
	{
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
	},
	{
		schema: invoiceItemLogSchema.refine(({ id }) => id !== -1n, {
			message: 'Specify an id to add a log'
		})
	}
)

export const editLog = updateData(
	{
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
	},
	{
		schema: invoiceItemLogSchema
	}
)
