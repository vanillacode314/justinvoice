<script lang="ts">
	import AppShell from '$/components/AppShell.svelte'
	import Spinner from '$/components/base/Spinner.svelte'
	import { alert } from '$/modals/AlertModal.svelte'
	import { loadingMessage, loadingStore, offlineMode, settings, userState } from '$/stores'
	import { entitySchema, invoiceItemLogSchema, invoiceSchema } from '$/types'
	import { browser } from '$app/environment'
	import { navigating, page } from '$app/stores'
	import type { Writable } from 'svelte/store'
	import type { PageData } from './$types'
	const modals = import.meta.glob('$/modals/auto-import/*.svelte', {
		eager: true,
		import: 'default'
	}) as Record<string, ConstructorOfATypedSvelteComponent>

	const loading = setContext<Writable<boolean>>('loading', loadingStore(navigating))

	$: data = $page.data as PageData

	function parsePageData(offlineMode: boolean, data: PageData) {
		if (!(!offlineMode && data.success)) return
		const { invoices, addressbook } = data.data
		Object.assign($userState, { invoices, addressbook })
		$userState = $userState
	}

	$: if (browser) {
		parsePageData($offlineMode, data)
	}

	function importLegacyState(remove: boolean = false) {
		if (localStorage.getItem('imported-legacy-state-v0')) return
		let legacyInvoices: any = localStorage.getItem('invoices')
		let legacyAddressbook: any = localStorage.getItem('addressbook')

		if (
			!(legacyInvoices || legacyAddressbook) &&
			!localStorage.getItem('imported-legacy-state-v0')
		) {
			localStorage.setItem('imported-legacy-state-v0', '1')
			alert({
				title: 'Migration done from older version',
				message:
					'Your invoices were imported from an older version of the app, Please check if all your data has been correctly migrated and if not report the issue on github to recover your data.'
			})
		}

		if (legacyInvoices) {
			legacyInvoices = JSON.parse(legacyInvoices) as any[]
			function transformLog(item: any): TInvoiceItemLog {
				return invoiceItemLogSchema.parse({
					id: String(item.id),
					title: item.title,
					description: item.description,
					type: item.type === 1 ? 'GOODS' : 'SERVICES',
					qty: item.qty,
					cost: item.price
				})
			}
			function transformInvoice(invoice: any): TInvoice {
				return invoiceSchema.parse({
					id: String(invoice.id),
					title: invoice.title,
					paid: invoice.paid,
					currency: invoice.items?.[0].currency || $settings.defaultCurrency,
					logs: (invoice.items || []).map(transformLog),
					dateOfIssue: invoice.date_of_issue,
					senderId: String(invoice.senderID),
					recipientId: String(invoice.recipientID)
				})
			}

			userState.update((val) => {
				const { invoices } = val

				invoices.push(
					...uniqByKey(diffByKey(legacyInvoices.map(transformInvoice), invoices, 'id'), 'id')
				)

				return val
			})

			remove && localStorage.removeItem('invoices')
		}
		if (legacyAddressbook) {
			legacyAddressbook = JSON.parse(legacyAddressbook) as any[]
			userState.update((val) => {
				const { addressbook } = val

				addressbook.push(
					...uniqByKey(
						diffByKey(
							z
								.array(entitySchema)
								.parse(legacyAddressbook.map((val: any) => ({ ...val, id: String(val.id) }))),
							addressbook,
							'id'
						),
						'id'
					)
				)

				return val
			})
			remove && localStorage.removeItem('addressbook')
		}
	}

	function migrateV1toV2(remove: boolean = false): void {
		if (localStorage.getItem('imported-user-state-v1')) return
		let userStateV1: any = localStorage.getItem('user-state-v1')

		if (userStateV1 && !localStorage.getItem('imported-user-state-v1')) {
			localStorage.setItem('imported-user-state-v1', '1')
			alert({
				title: 'Migration done from older version',
				message:
					'Your invoices were imported from an older version of the app, Please check if all your data has been correctly migrated and if not report the issue on github to recover your data.'
			})
		}

		if (userStateV1) {
			userStateV1 = JSON.parse(userStateV1)
			let ids: bigint[] = []
			const addressMap = {} as Record<string, BigInt>
			userStateV1.addressbook = userStateV1.addressbook.map((address: any) => {
				const id = genId(ids)
				addressMap[address.id] = id
				address.id = id
				ids.push(address.id)
				return address
			})
			userStateV1.invoices = userStateV1.invoices.map((invoice: any) => {
				invoice.id = genId(ids)
				invoice.senderId = addressMap[invoice.senderId]
				invoice.recipientId = addressMap[invoice.recipientId]
				ids.push(invoice.id)
				invoice.logs = invoice.logs.map((log: any) => {
					log.id = genId(ids)
					ids.push(log.id)
					return log
				})
				return invoice
			})
			userStateV1.defaultSender = null
			$userState = userStateV1
		}
		remove && localStorage.removeItem('user-state-v1')
	}

	onMount(() => {
		if (!$offlineMode) return
		importLegacyState()
		migrateV1toV2()
	})
</script>

<AppShell>
	{#if $loading || !browser}
		<div class="grid place-content-center h-full p-5 justify-items-center gap-5">
			<Spinner />
			{#if loadingMessage}
				<span class="uppercase font-bold trackin-wide text-3xl">{$loadingMessage}</span>
			{/if}
		</div>
	{:else}
		<slot />
	{/if}
</AppShell>

{#each Object.values(modals) as modal}
	<svelte:component this={modal} />
{/each}

<style uno:preflights uno:safelist global></style>
