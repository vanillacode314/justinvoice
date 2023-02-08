import { entitySchema, invoiceSchema } from '$/types'
import { browser } from '$app/environment'
import { goto, invalidate } from '$app/navigation'
import * as devalue from 'devalue'
import type { Readable } from 'svelte/store'
import { z } from 'zod'

export const actionSchema = z.object({
	icon: z.string(),
	color: z.string().default(''),
	label: z.string(),
	action: z.function(),
	noClose: z.boolean().default(false),
	noFab: z.boolean().default(false)
})
export type TAction = z.infer<typeof actionSchema>

export const appStateSchema = z.object({
	selectedInvoiceId: z.bigint().default(-1n),
	selectedItemId: z.bigint().default(-1n),
	selectedAddressId: z.bigint().default(-1n),
	drawerVisible: z.boolean().default(false),
	selectionMode: z.boolean().default(false),
	actions: actionSchema.or(z.literal('spacer')).array().default(Array)
})
export type TAppState = z.infer<typeof appStateSchema>
export const appState = writable<TAppState>(appStateSchema.parse({}))

export const settingsSchema = z.object({
	defaultSender: z.bigint().nullable().default(null),
	defaultCurrency: z.string().default('USD')
})
export type TSettings = z.infer<typeof settingsSchema>
export const settings = persisted<TSettings>('settings-v1', settingsSchema.parse({}), {
	serializer: {
		parse(value) {
			const result = settingsSchema.safeParse(JSON.parse(value))
			return result.success ? result.data : settingsSchema.parse({})
		},
		stringify(object) {
			return JSON.stringify(settingsSchema.parse(object))
		}
	}
})

export const userStateSchema = z.object({
	invoices: invoiceSchema
		.array()
		.default(Array)
		.transform((val) => uniqByKey(val, 'id')),
	addressbook: entitySchema
		.array()
		.default(Array)
		.transform((val) => uniqByKey(val, 'id'))
})
export type TUserState = z.infer<typeof userStateSchema>
export const offlineMode = persisted<boolean>('offline-mode', false)
offlineMode.subscribe(async ($offlineMode) => {
	if (!browser) return
	const url = new URL(location.href)
	const urlState = Boolean(url.searchParams.get('offlineMode'))
	if (urlState === $offlineMode) return
	$offlineMode
		? url.searchParams.set('offlineMode', 'true')
		: url.searchParams.delete('offlineMode')
	await goto(url)
	await invalidate('offlineMode')
})

function userStateStore() {
	const localUserState = persisted<TUserState>('user-state-v2', userStateSchema.parse({}), {
		serializer: {
			parse(value) {
				return userStateSchema.parse(devalue.parse(value))
			},
			stringify(object) {
				return devalue.stringify(userStateSchema.parse(object))
			}
		}
	})
	const remoteUserState = writable<TUserState>(userStateSchema.parse({}))
	const { subscribe } = derived<
		[typeof offlineMode, typeof localUserState, typeof remoteUserState],
		TUserState
	>(
		[offlineMode, localUserState, remoteUserState],
		([$offlineMode, $localUserState, $remoteUserState]) => {
			return $offlineMode ? $localUserState : $remoteUserState
		}
	)

	return {
		toggleOfflineMode: () => offlineMode.update((val) => !val),
		set: (value: TUserState) => {
			get(offlineMode)
				? localUserState.set(userStateSchema.parse(value))
				: remoteUserState.set(userStateSchema.parse(value))
		},
		update: (value: (prev: TUserState) => TUserState) => {
			get(offlineMode)
				? localUserState.update((prev) => userStateSchema.parse(value(prev)))
				: remoteUserState.update((prev) => userStateSchema.parse(value(prev)))
		},
		subscribe
	}
}
export const userState = userStateStore()

export const loadingMessage = writable<string>('')
export function loadingStore(navigating: Readable<any>) {
	const store = writable<boolean>(false)

	const { subscribe } = derived<[typeof navigating, typeof store], boolean>(
		[navigating, store],
		([$navigating, $store]) => $store || $navigating
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
