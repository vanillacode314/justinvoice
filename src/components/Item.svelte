<script lang="ts">
	import { editItemModalOpen } from '$/modals/auto-import/EditItemModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { appState, userState } from '$/stores'
	import type { TInvoiceItemLog } from '$/types'

	/// STATE ///
	export let id: TInvoiceItemLog['id']
	export let type: TInvoiceItemLog['type']
	export let title: TInvoiceItemLog['title']
	export let qty: TInvoiceItemLog['qty']
	export let cost: TInvoiceItemLog['cost']
	export let description: TInvoiceItemLog['description']

	$: selectedInvoice = $userState.invoices.find(({ id }) => id === $appState.selectedInvoiceId)

	/// METHODS ///
	function removeItem() {
		if (!selectedInvoice) return
		selectedInvoice.logs = selectedInvoice.logs.filter((i) => i.id !== id)
		$userState = $userState
	}

	function editItem() {
		$appState.selectedItemId = id
		$editItemModalOpen = true
		$appState = $appState
	}
</script>

<div class="rounded-xl max-w-96 bg-stone-900">
	<div class="card-body h-full">
		<h2 class="card-title items-baseline">
			<span>{title}</span>
			<div class="grow" />
			<div class="badge badge-outline">
				{type === 'GOODS' ? 'Goods' : 'Service'}
			</div>
		</h2>
		<p class="flex gap-1 items-center">
			<span>Quantity:</span><span class="font-bold">
				{qty}
			</span>
		</p>
		<p class="flex gap-1 items-center">
			<span>Price:</span><span class="font-bold">
				{cost}
				{selectedInvoice?.currency}
			</span>
		</p>
		<p class="flex gap-1 items-center">
			<span>Subtotal:</span><span class="font-bold">
				{cost} &times; {qty} = {cost * qty}
				{selectedInvoice?.currency}
			</span>
		</p>
		<!-- <p> -->
		<!-- 	{description} -->
		<!-- </p> -->
		<span class="grow" />
		<div class="card-actions justify-end mt-3">
			<button class="btn btn-primary btn-sm flex gap-1 items-center" on:click={editItem}>
				<span class="i-mdi-pencil text-lg" />
				<span>Edit</span>
			</button>
			<ConfirmModal
				title="Delete Invoice Item"
				message="Are you sure you want to delete this invoice item?"
				on:confirm={removeItem}
			>
				<button class="btn btn-ghost text-red-400 btn-sm">Remove</button>
			</ConfirmModal>
		</div>
	</div>
</div>
