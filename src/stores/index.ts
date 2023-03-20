import { entitySchema, invoiceSchema } from '$/types'
import { browser } from '$app/environment'
import { goto, invalidate } from '$app/navigation'
import * as devalue from 'devalue'
import type { Readable } from 'svelte/store'
import { z } from 'zod'

const modes = ['default', 'selection'] as const
export const actionSchema = z
	.object({
		id: z.string().optional(),
		icon: z.string(),
		color: z
			.string()
			.default('')
			.transform((value) => () => value)
			.or(z.function().returns(z.string())),
		label: z
			.string()
			.transform((value) => () => value)
			.or(z.function().returns(z.string())),
		mode: z.enum(modes).default('default'),
		action: z.function(),
		noClose: z.boolean().default(false),
		noFab: z.boolean().default(false)
	})
	.transform((action) => ({
		...action,
		id:
			action.id ||
			action
				.label()
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
	}))
export type TAction = z.infer<typeof actionSchema>

const ternaryFilterSchema = z.boolean().nullable().default(null)
const stringFilterSchema = z.string().nullable().default(null)
const internalAppStateSchema = z.object({
	invoiceFilters: z
		.object({
			paid: ternaryFilterSchema,
			query: stringFilterSchema
		})
		.default({}),
	selectedInvoiceId: z.bigint().default(-1n),
	selectedLogId: z.bigint().default(-1n),
	selectedAddressId: z.bigint().default(-1n),
	drawerVisible: z.boolean().default(false),
	selectedItems: z.boolean().default(false).array().default(Array),
	actions: actionSchema
		.or(z.literal('spacer'))
		.array()
		.default(Array)
		.transform((actions) =>
			actions.filter(
				(action1, index) =>
					action1 === 'spacer' ||
					actions.findIndex((action2) => action2 !== 'spacer' && action2.id === action1.id) ===
						index
			)
		)
})
type TInternalAppState = z.infer<typeof internalAppStateSchema>
export const appStateSchema = internalAppStateSchema.extend({
	mode: z.enum(modes).default('default')
})
export type TAppState = z.infer<typeof appStateSchema>
function appStateStore() {
	const internalAppState = writable<TInternalAppState>(internalAppStateSchema.parse({}))
	const { set, update } = internalAppState
	const { subscribe } = derived<[typeof internalAppState], TAppState>(
		[internalAppState],
		([$internalAppState]) => {
			const selectionMode = $internalAppState.selectedItems.some(Boolean)
			const allSelected = $internalAppState.selectedItems.every(Boolean)
			return appStateSchema.parse({
				...$internalAppState,
				mode: selectionMode ? 'selection' : 'default',
				actions: [
					...$internalAppState.actions,
					{
						id: 'select-all',
						icon: 'i-mdi-select-all',
						label: allSelected ? 'Deselect All' : 'Select All',
						mode: 'selection',
						action: () =>
							internalAppState.update(($internalAppState) => {
								$internalAppState.selectedItems = $internalAppState.selectedItems.fill(!allSelected)
								return $internalAppState
							})
					},
					{
						icon: 'i-mdi-swap-horizontal',
						label: 'Invert Selection',
						mode: 'selection',
						action: () =>
							internalAppState.update(($internalAppState) => {
								$internalAppState.selectedItems = $internalAppState.selectedItems.map((val) => !val)
								return $internalAppState
							})
					}
				]
			})
		}
	)
	return {
		set,
		update,
		subscribe
	}
}
export const appState = appStateStore()

export const settingsSchema = z.object({
	defaultSender: z.bigint().nullable().default(null),
	defaultCurrency: z.string().default('USD')
})
export type TSettings = z.infer<typeof settingsSchema>
export const settings = persisted<TSettings>('settings-v1', settingsSchema.parse({}), {
	serializer: {
		parse(value) {
			try {
				return settingsSchema.parse(devalue.parse(value))
			} catch {
				return settingsSchema.parse({})
			}
		},
		stringify(object) {
			return devalue.stringify(settingsSchema.parse(object))
		}
	}
})

export const internalUserStateSchema = z.object({
	invoices: invoiceSchema
		.array()
		.default(Array)
		.transform((val) => uniqByKey(val, 'id')),
	addressbook: entitySchema
		.array()
		.default(Array)
		.transform((val) => uniqByKey(val, 'id'))
})
export type TInternalUserState = z.infer<typeof internalUserStateSchema>
export const userStateSchema = internalUserStateSchema.extend({
	filteredInvoices: invoiceSchema.array().default([])
})
export type TUserState = z.infer<typeof userStateSchema>

export const offlineMode = persisted<boolean>('offline-mode', false)
offlineMode.subscribe(async ($offlineMode) => {
	if (!browser) return
	const url = new URL(location.href)
	const urlState = Boolean(url.searchParams.get('offlineMode'))
	if (urlState === $offlineMode) return
	const newUrl = new URL(window.location.origin + '/app')
	if ($offlineMode) newUrl.searchParams.set('offlineMode', 'true')
	await goto(newUrl)
	await invalidate('offlineMode')
})

function userStateStore() {
	const localUserState = persisted<TInternalUserState>('user-state-v2', userStateSchema.parse({}), {
		serializer: {
			parse(value) {
				try {
					return internalUserStateSchema.parse(devalue.parse(value))
				} catch {
					return internalUserStateSchema.parse({})
				}
			},
			stringify(object) {
				return devalue.stringify(internalUserStateSchema.parse(object))
			}
		}
	})
	const remoteUserState = writable<TInternalUserState>(userStateSchema.parse({}))
	const { subscribe } = derived<
		[typeof offlineMode, typeof localUserState, typeof remoteUserState, typeof appState],
		TUserState
	>(
		[offlineMode, localUserState, remoteUserState, appState],
		([$offlineMode, $localUserState, $remoteUserState, $appState]) => {
			if ($offlineMode) {
				const filters = $appState.invoiceFilters
				return Object.assign($localUserState, {
					filteredInvoices: $localUserState.invoices.filter((invoice) => {
						let condition: boolean = true
						if (filters.query !== null) {
							condition = invoice.title.toLowerCase().includes(filters.query.toLowerCase())
						}
						if (filters.paid !== null) {
							condition = condition && invoice.paid === filters.paid
						}
						return condition
					})
				})
			} else {
				return Object.assign($remoteUserState, { filteredInvoices: $remoteUserState.invoices })
			}
		}
	)

	return {
		toggleOfflineMode: () => offlineMode.update((val) => !val),
		set: (value: TInternalUserState) => {
			get(offlineMode)
				? localUserState.set(userStateSchema.parse(value))
				: remoteUserState.set(userStateSchema.parse(value))
		},
		update: (value: (prev: TInternalUserState) => TInternalUserState) => {
			get(offlineMode)
				? localUserState.update((prev) => userStateSchema.parse(value(prev)))
				: remoteUserState.update((prev) => userStateSchema.parse(value(prev)))
		},
		subscribe
	}
}
export const userState = userStateStore()

export const loadingMessage = writable<string>('')
export function loadingStore(navigating: Readable<unknown>) {
	const store = writable<boolean>(false)

	const { subscribe } = derived<[typeof navigating, typeof store], boolean>(
		[navigating, store],
		([$navigating, $store]) => $store || !!$navigating
	)
	return {
		set: (value: boolean) => {
			!value && loadingMessage.set('')
			store.set(value)
		},
		update: (value: (prev: boolean) => boolean) => store.update(value),
		subscribe
	}
}
