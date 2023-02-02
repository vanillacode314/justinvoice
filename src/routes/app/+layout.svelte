<script lang="ts">
	import '$/app.css'
	import AppShell from '$/components/AppShell.svelte'
	import Spinner from '$/components/base/Spinner.svelte'
	import AddNewAddressModal from '$/modals/AddNewAddressModal.svelte'
	import AddNewItemModal from '$/modals/AddNewItemModal.svelte'
	import AlertModal, { alert } from '$/modals/AlertModal.svelte'
	import CreateNewInvoiceModal from '$/modals/CreateNewInvoiceModal.svelte'
	import EditAddressModal from '$/modals/EditAddressModal.svelte'
	import EditInvoiceModal from '$/modals/EditInvoiceModal.svelte'
	import EditItemModal from '$/modals/EditItemModal.svelte'
	import { userState } from '$/stores'
	import {
		entitySchema,
		invoiceItemLogSchema,
		invoiceSchema,
		type TInvoice,
		type TInvoiceItemLog
	} from '$/types'
	import { browser } from '$app/environment'
	import { navigating } from '$app/stores'
	import 'uno.css'

	function importLegacyState() {
		if (!localStorage.getItem('imported-legacy-state-v0', '1')) {
			localStorage.setItem('imported-legacy-state-v0', '1')
			alert({
				title: 'Migration done from older version',
				message:
					'Your invoices were imported from an older version of the app, Please check if all your data has been correctly migrated and if not report the issue on github to recover your data.'
			})
		}

		let legacyInvoices: any = localStorage.getItem('invoices')
		let legacyAddressbook: any = localStorage.getItem('addressbook')

		if (legacyInvoices) {
			legacyInvoices = JSON.parse(legacyInvoices) as any[]
			function transformLog(item: any): TInvoiceItemLog {
				return invoiceItemLogSchema.parse({
					id: String(item.id),
					title: item.title,
					description: item.description,
					type: item.type === 0 ? 'GOODS' : 'SERVICES',
					qty: item.qty,
					cost: item.price
				})
			}
			function transformInvoice(invoice: any): TInvoice {
				return invoiceSchema.parse({
					id: String(invoice.id),
					title: invoice.title,
					paid: invoice.paid,
					currency: invoice.items?.[0].currency || $userState.defaultCurrency,
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

			/* localStorage.removeItem('invoices') */
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
			/* localStorage.removeItem('addressbook') */
		}
	}

	onMount(() => {
		importLegacyState()
	})
</script>

<AppShell>
	{#if $navigating || !browser}
		<div class="grid place-items-center p-5">
			<Spinner />
		</div>
	{:else}
		<slot />
	{/if}
</AppShell>

<CreateNewInvoiceModal />
<AddNewAddressModal />
<AddNewItemModal />
<EditAddressModal />
<EditInvoiceModal />
<EditItemModal />
<AlertModal />

<style uno:preflights uno:safelist global></style>
