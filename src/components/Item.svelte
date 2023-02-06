<script lang="ts">
	import { alert } from '$/modals/AlertModal.svelte'
	import { editItemModalOpen } from '$/modals/auto-import/EditItemModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { appState, userState } from '$/stores'
	import type { TInvoiceItemLog } from '$/types'
	import Selectable from './base/Selectable.svelte'

	/// STATE ///
	export let id: TInvoiceItemLog['id']
	export let type: TInvoiceItemLog['type']
	export let title: TInvoiceItemLog['title']
	export let qty: TInvoiceItemLog['qty']
	export let cost: TInvoiceItemLog['cost']
	export let description: TInvoiceItemLog['description']
	export let selected: boolean = false

	$: selectedInvoice = $userState.invoices.find(({ id }) => id === $appState.selectedInvoiceId)

	function editItem() {
		$appState.selectedItemId = id
		$editItemModalOpen = true
		$appState = $appState
	}
</script>

<Selectable bind:selected>
	<div class="rounded-xl bg-stone-900">
		<div class="card-body h-full">
			<h2 class="card-title items-baseline">
				<span>{title}</span>
				<div class="grow" />
				<div class="badge uppercase font-semibold text-xs">
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
			<span class="grow h-full" />
			<div class="w-full card-actions justify-end mt-3 gap-3">
				<button class="btn btn-primary btn-sm flex gap-1 items-center" on:click={editItem}>
					<span class="i-mdi-pencil text-lg" />
					<span>Edit</span>
				</button>
				<ConfirmModal
					title="Delete Invoice Item"
					message="Are you sure you want to delete this invoice item?"
					on:confirm={() => {
						if (!$appState.selectedInvoiceId) return
						removeItems($appState.selectedInvoiceId, [id])
					}}
				>
					<button class="btn btn-ghost text-red-400 btn-sm">Remove</button>
				</ConfirmModal>
				{#if description}
					<button
						type="button"
						class="btn btn-ghost btn-sm flex gap-1 items-center"
						on:click={() => {
							alert({
								title,
								message: description,
								icon: 'i-mdi-comment'
							})
						}}
					>
						<span class="i-mdi-comment text-lg" />
						<span>Description</span>
					</button>
				{/if}
			</div>
		</div>
	</div>
</Selectable>
