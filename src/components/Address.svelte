<script lang="ts">
	import { editAddressModalOpen } from '$/modals/auto-import/EditAddressModal.svelte'
	import { entityNotesModalOpen } from '$/modals/auto-import/EntityNotesModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { appState } from '$/stores'
	import Button from './base/Button.svelte'
	import Selectable from './base/Selectable.svelte'

	/// STATE ///
	export let id: TEntity['id']
	export let name: TEntity['name']
	export let address: TEntity['address']
	export let selected: boolean = false

	function onEdit() {
		$appState.selectedAddressId = id
		$editAddressModalOpen = true
	}

	async function onRemove() {
		await removeAddresses([id])
	}
</script>

<Selectable bind:selected>
	<div class="card bg-stone-900 shadow p-5 flex flex-col gap-3">
		<h2 class="card-title">{name}</h2>
		<p>{address}</p>
		<span class="grow" />
		<div class="card-actions justify-end">
			<Button class="btn-primary btn-sm" icon="i-mdi-edit" on:click={onEdit}>Edit</Button>
			<Button
				type="button"
				class="btn-sm btn-ghost"
				icon="i-mdi-notes"
				on:click={() => ($entityNotesModalOpen = true)}>Notes</Button
			>
			<ConfirmModal
				icon="i-mdi-warning"
				title="Delete Address"
				message="Are you sure you would like to delete this address? All invoices using the address will be removed."
				on:confirm={(e) => e.detail(onRemove)}
			>
				<Button class="btn-ghost btn-sm text-error">Remove</Button>
			</ConfirmModal>
		</div>
	</div>
</Selectable>
