<script lang="ts">
	import { toast } from '$/components/base/Toast.svelte'
	import Item from '$/components/Item.svelte'
	import { alert } from '$/modals/AlertModal.svelte'
	import { addNewItemModalOpen } from '$/modals/auto-import/AddNewItemModal.svelte'
	import { editInvoiceModalOpen } from '$/modals/auto-import/EditInvoiceModal.svelte'
	import { invoiceNotesModalOpen } from '$/modals/auto-import/InvoiceNotesModal.svelte'
	import { prompt } from '$/modals/auto-import/PromptModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { actionSchema, appState, userState } from '$/stores'
	import { exportToJsonFile } from '$/utils'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	$: id = BigInt($page.params.id)
	$: invoice = $userState.invoices.find((i) => i.id === id)
	$: $appState.selectedInvoiceId = id
	let deleteInvoiceModalOpen: boolean = false
	let deleteItemsModalOpen: boolean = false
	let copyState: 'neutral' | 'success' | 'error' = 'neutral'

	$: recipient = $userState.addressbook.find((address) => address.id == invoice?.recipientId)
	$: sender = $userState.addressbook.find((address) => address.id == invoice?.senderId)

	$: stats =
		invoice && sender && recipient
			? [
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
		await removeInvoice([id])
		await goto('/app')
	}

	function addItem() {
		$addNewItemModalOpen = true
	}

	async function exportInvoice() {
		if (!(invoice && sender && recipient)) return

		const name = await prompt({
			icon: 'i-mdi-export',
			title: 'Export Invoice',
			message: 'Enter filename (id will be auto appended to the name):',
			initialValue: invoice.title
				.toLowerCase()
				.replace(/[^a-z0-9\s]/g, '')
				.replace(/\s+/g, ' ')
				.replace(/ /g, '_')
		})
		if (!name) return
		exportToJsonFile(
			{
				invoices: [invoice],
				addressbook: uniqByKey([sender, recipient], 'id')
			},
			`${name}-${invoice.id}.json`
		)
	}

	async function onPaidChange(e: Event) {
		if (!invoice) return
		const inp = e.currentTarget as HTMLInputElement
		const { checked } = inp
		inp.indeterminate = true
		const result = await editInvoice({ ...invoice, paid: checked }).finally(
			() => (inp.indeterminate = false)
		)
		if (!result.success) {
			toast(result.error.code, result.error.message, { type: 'error', duration: 5000 })
		}
	}

	function print() {
		if (!invoice) return
		if (invoice.logs.length === 0) {
			alert({
				title: 'Empty Invoice',
				message: 'Add atleast one item to print the invoice',
				icon: 'i-mdi-warning'
			})
			return
		}
		window.open(`/pdf/${id}`, '_blank')
	}

	onMount(() => {
		if (!(invoice && sender && recipient)) return

		$appState.actions = z
			.union([actionSchema, z.literal('spacer')])
			.array()
			.parse([
				{
					icon: 'i-mdi-arrow-back',
					label: 'Back',
					noFab: true,
					action: () => goto('/app')
				},
				'spacer',
				{
					icon: 'i-mdi-trash',
					mode: 'selection',
					label: 'Delete',
					color: 'btn-error',
					action: () => (deleteItemsModalOpen = true)
				},
				{
					icon: 'i-mdi-notes',
					label: 'Notes',
					action: () => ($invoiceNotesModalOpen = true)
				},
				{
					icon: 'i-mdi-clipboard',
					label:
						copyState === 'neutral'
							? 'Copy ID'
							: copyState === 'success'
							? 'Copy Success'
							: 'Copy Error',
					color:
						copyState === 'neutral' ? '' : copyState === 'success' ? 'btn-success' : 'btn-error',
					action: () => {
						copyState = 'neutral'
						try {
							navigator.clipboard.writeText(String(id))
							copyState = 'success'
						} catch {
							copyState = 'error'
						} finally {
							setTimeout(() => (copyState = 'neutral'), 3000)
						}
					}
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
					icon: 'i-mdi-edit',
					label: 'Edit',
					action: () => ($editInvoiceModalOpen = true)
				},
				{
					icon: 'i-mdi-trash',
					label: 'Delete',
					color: 'btn-error',
					action: () => (deleteInvoiceModalOpen = true)
				},
				{
					icon: 'i-mdi-add',
					label: 'Add Item',
					color: 'btn-primary',
					action: addItem
				}
			])
	})
	onDestroy(() => {
		$appState.selectedItems = $appState.selectedItems.fill(false)
		$appState.actions = []
	})
</script>

<div class="p-5 min-h-full flex flex-col">
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
								checked={invoice.paid}
								on:change={onPaidChange}
							/>
							<span class="label-text">Paid</span>
						</label>
					</div>
				</h2>
				<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
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
		{#if invoice.logs.length === 0}
			<div class="flex flex-col gap-5 items-center justify-center p-10 grow">
				<span class="i-mdi-file-document-multiple text-6xl" />
				<h2 class="text-xl uppercase font-bold">No logs yet</h2>
				<button
					class="flex items-center gap-1 btn btn-success"
					on:click={() => ($addNewItemModalOpen = true)}
				>
					<span class="i-mdi-add text-lg" />
					<span>Add New Log</span>
				</button>
			</div>
		{:else}
			<div class="grid gap-5 mt-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
				{#each invoice.logs as log, index (log.id)}
					<div
						animate:flip={{ duration: 300 }}
						in:fade={{ duration: 150 }}
						out:scale|local
						class="grid"
					>
						<Item
							{...log}
							currency={invoice.currency}
							bind:selected={$appState.selectedItems[index]}
						/>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="flex flex-col gap-5 items-center justify-center grow">
			<h2 class="text-xl uppercase font-bold">Invoice not found</h2>
			<a class="flex items-center gap-1 btn btn-primary" href="/app">
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
	on:confirm={(e) => e.detail(deleteInvoice)}
	bind:open={deleteInvoiceModalOpen}
/>

<ConfirmModal
	icon="i-mdi-warning"
	title="Delete Selected Items"
	message="Are you sure you want to delete all selected items?"
	on:confirm={(e) => {
		e.detail(async () => {
			if (!invoice) return
			const result = await removeLogs(
				id,
				getSelectedFromArray(invoice.logs, $appState.selectedItems).map((address) => address.id)
			)
			if (!result.success) {
				toast(result.error.code, result.error.message, { type: 'error', duration: 5000 })
			}
			$appState.selectedItems = $appState.selectedItems.fill(false)
		})
	}}
	on:cancel={() => {
		$appState.selectedItems = $appState.selectedItems.fill(false)
	}}
	bind:open={deleteItemsModalOpen}
/>
