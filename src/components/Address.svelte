<script lang="ts">
	import { editAddressModalOpen } from '$/modals/auto-import/EditAddressModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { appState } from '$/stores'
	import type { TEntity } from '$/types'

	/// STATE ///
	export let id: TEntity['id']
	export let name: TEntity['name']
	export let address: TEntity['address']

	function onEdit() {
		$appState.selectedAddressId = id
		$editAddressModalOpen = true
	}
</script>

<div class="card max-w-96 bg-stone-900 shadow p-5 flex flex-col gap-3">
	<h2 class="card-title">{name}</h2>
	<p>{address}</p>
	<div class="card-actions justify-end mt-auto">
		<button class="btn btn-primary btn-sm flex gap-1 items-center" on:click={onEdit}>
			<span class="i-mdi-edit" />
			<span>Edit</span>
		</button>
		<ConfirmModal
			icon="i-mdi-warning"
			title="Delete Address"
			message="Are you sure you would like to delete this address? All invoices using the address will be removed."
			on:confirm={() => removeAddress(id)}
		>
			<button class="btn btn-ghost btn-sm text-error flex gap-1 items-center">
				<span class="i-mdi-trash" />
				<span>Remove</span>
			</button>
		</ConfirmModal>
	</div>
</div>
