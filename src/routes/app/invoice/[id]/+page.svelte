<script lang="ts">
	import Item from '$/components/Item.svelte'
	import { addNewItemModalOpen } from '$/modals/auto-import/AddNewItemModal.svelte'
	import { alert } from '$/modals/auto-import/AlertModal.svelte'
	import { editInvoiceModalOpen } from '$/modals/auto-import/EditInvoiceModal.svelte'
	import { prompt } from '$/modals/auto-import/PromptModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { actionSchema, appState, userState } from '$/stores'
	import { exportToJsonFile } from '$/utils'
	import { removeInvoice } from '$/utils/invoice'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	/// STATE ///
	$: id = $page.params.id
	$: invoice = $userState.invoices.find((i) => i.id === id)
	$: $appState.selectedInvoiceId = id
	let deleteInvoiceModalOpen: boolean = false
	let deleteItemsModalOpen: boolean = false
	let selectedItems: boolean[] = []

	$: recipient = $userState.addressbook.find(({ id }) => id == invoice?.recipientId)
	$: sender = $userState.addressbook.find(({ id }) => id == invoice?.senderId)

	$: stats =
		invoice && sender && recipient
			? [
					{
						label: 'Total Cost',
						value: invoice.logs.reduce((sum, { cost }) => sum + cost, 0) + ' ' + invoice.currency
					},
					{ label: 'Date of Issue', value: formatDate(new Date(invoice.dateOfIssue)) },
					{ label: 'Sender', value: `${sender.name}, ${sender.address}` },
					{ label: 'Recipient', value: `${recipient.name}, ${recipient.address}` }
			  ]
			: []

	/// METHODS ///
	function formatDate(date: Date) {
		return date.toLocaleDateString(navigator.language, {
			dateStyle: 'full'
		})
	}

	async function deleteInvoice() {
		await goto('/app')
		removeInvoice(id)
	}

	function addItem() {
		$addNewItemModalOpen = true
	}

	function editInvoice() {
		$editInvoiceModalOpen = true
	}

	async function exportInvoice() {
		if (!(invoice && sender && recipient)) return

		const name = await prompt({
			icon: 'i-mdi-export',
			title: 'Export Invoice',
			message: 'Enter filename (id will be auto appended to the name):',
			initialValue: invoice.title
		})
		if (!name) return
		const archived = $userState.archivedInvoices.some(({ id }) => id === invoice?.id)
		exportToJsonFile(
			{
				[archived ? 'archivedInvoices' : 'invoices']: [invoice],
				addressbook: uniqByKey([sender, recipient], 'id')
			},
			`${name}-${invoice.id}.json`
		)
	}

	function onPaidChange() {
		$userState = $userState
	}

	function print() {
		if (!invoice) return
		if (invoice.logs.length === 0) {
			alert({
				title: 'Empty Invoice',
				message: 'Add ateast one item to print invoice',
				icon: 'i-mdi-warning'
			})
			return
		}
		window.open(`/pdf/${id}`, '_blank')
	}

	$: $appState.selectionMode = selectedItems.some((val) => val === true)
	$: selectedItems.length = invoice ? invoice.logs.length : 0
	$: $appState.actions = z.array(z.union([actionSchema, z.literal('spacer')])).parse(
		$appState.selectionMode
			? [
					{
						icon: 'i-mdi-trash',
						label: 'Delete Items',
						action: () => (deleteItemsModalOpen = true)
					}
			  ]
			: [
					{
						icon: 'i-mdi-arrow-back',
						label: 'Back',
						noFab: true,
						action: () => goto('/app')
					},
					'spacer',
					{
						icon: 'i-mdi-clipboard',
						label: 'Copy ID',
						action: () => navigator.clipboard.writeText(id)
					},
					{
						icon: 'i-mdi-printer',
						label: 'Print',
						action: print
					},
					{
						icon: 'i-mdi-export',
						label: 'Export',
						action: exportInvoice
					},
					{
						icon: 'i-mdi-trash',
						label: 'Delete',
						action: () => (deleteInvoiceModalOpen = true)
					},
					{
						icon: 'i-mdi-edit',
						label: 'Edit',
						action: editInvoice
					},
					{
						icon: 'i-mdi-add',
						label: 'Add Item',
						color: 'btn-primary',
						action: addItem
					}
			  ]
	)

	onDestroy(() => {
		selectedItems.fill(false)
		$appState.actions = []
	})
</script>

<div class="p-5 min-h-full">
	{#if invoice}
		<div
			class="card w-full shadow-xl card-compact transition-colors"
			class:bg-red-900={!invoice.paid}
			class:bg-green-900={invoice.paid}
		>
			<div class="card-body flex flex-col !p-8 gap-5">
				<h2 class="card-title">
					<span>{invoice.title}</span>
					<!-- <div class="badge badge-outline">ID: {invoice.id}</div> -->
					<span class="grow" />
					<div class="form-control">
						<label class="label cursor-pointer gap-3">
							<input
								type="checkbox"
								class="toggle toggle-sm"
								bind:checked={invoice.paid}
								on:change={onPaidChange}
							/>
							<span class="label-text">Paid</span>
						</label>
					</div>
				</h2>
				<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
					{#each stats as { label, value } (label)}
						<article class="flex w-full flex-col gap-1 p-5 bg-black/10 rounded-xl">
							<span class="font-medium uppercase tracking-wide text-xs">{label}</span>
							<span class="text-xl font-bold">
								{value}
							</span>
						</article>
					{/each}
				</div>
			</div>
		</div>
		<div class="grid gap-5 mt-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
			{#each invoice.logs as log, index (log.id)}
				<div
					animate:flip={{ duration: 300 }}
					in:fade={{ duration: 150 }}
					out:scale|local
					class="grid"
				>
					<Item {...log} bind:selected={selectedItems[index]} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col gap-5 items-center h-full justify-center">
			<p class="text-xl font-bold">Invoice Not Found</p>
			<a class="flex items-center gap-1 btn btn-success" href="/app">
				<span class="i-mdi-arrow-back text-lg" />
				<span>Go Back</span>
			</a>
		</div>
	{/if}
</div>
<ConfirmModal
	icon="i-mdi-warning"
	title="Delete Invoice"
	message="Are you sure you want to delete this invoice and all of it's data?"
	on:confirm={deleteInvoice}
	bind:open={deleteInvoiceModalOpen}
/>

<ConfirmModal
	icon="i-mdi-warning"
	title="Delete Selected Items"
	message="Are you sure you want to delete all selected items?"
	on:confirm={() => {
		if (!invoice) return
		removeItems(
			id,
			invoice.logs.filter((_log, index) => selectedItems[index] === true).map(({ id }) => id)
		)
		selectedItems.fill(false)
	}}
	bind:open={deleteItemsModalOpen}
/>
