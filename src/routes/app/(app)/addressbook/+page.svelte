<script lang="ts">
	import Address from '$/components/Address.svelte'
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { actionSchema, appState, userState } from '$/stores'

	let selectedAddresses: boolean[] = []
	let deleteModalOpen: boolean = false

	$: $appState.selectionMode = selectedAddresses.some((val) => val === true)
	$: selectedAddresses.length = $userState.addressbook.length

	function getActions(selectionMode: boolean, ..._args: any[]) {
		const allSelected = selectedAddresses.every((val) => val === true)
		return actionSchema.array().parse(
			selectionMode
				? [
						{
							icon: 'i-mdi-select-all',
							label: allSelected ? 'Deselect All' : 'Select All',
							action: () => (selectedAddresses = selectedAddresses.fill(!allSelected))
						},
						{
							icon: 'i-mdi-swap-horizontal',
							label: 'Invert Selection',
							action: () => (selectedAddresses = selectedAddresses.map((val) => !val))
						},
						{
							icon: 'i-mdi-trash',
							label: 'Delete',
							action: () => (deleteModalOpen = true)
						}
				  ]
				: [
						{
							icon: 'i-mdi-add',
							label: 'Add',
							color: 'btn-primary',
							action: () => ($addNewAddressModalOpen = true)
						}
				  ]
		)
	}

	$: $appState.actions = getActions($appState.selectionMode, selectedAddresses)

	onMount(() => {
		$appState.actions = actionSchema.array().parse([
			{
				icon: 'i-mdi-add',
				label: 'Add',
				color: 'btn-primary',
				action: () => ($addNewAddressModalOpen = true)
			},
			{
				icon: 'i-mdi-trash',
				label: 'Delete',
				action: () => (deleteModalOpen = true)
			}
		])
	})

	onDestroy(() => {
		selectedAddresses.fill(false)
		$appState.actions = []
	})
</script>

{#if $userState.addressbook.length === 0}
	<div class="flex flex-col gap-5 items-center h-full justify-center">
		<span class="i-mdi-file-document-multiple text-6xl" />
		<h2 class="text-xl uppercase font-bold">No addresses yet</h2>
		<button
			class="flex items-center gap-1 btn btn-success"
			on:click={() => ($addNewAddressModalOpen = true)}
		>
			<span class="i-mdi-add text-lg" />
			<span>Add New Address</span>
		</button>
	</div>
{:else}
	<div class="p-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
		{#each $userState.addressbook as address, index (address.id)}
			<div
				animate:flip={{ duration: 300 }}
				in:fade={{ duration: 150 }}
				out:scale|local
				class="grid"
			>
				<Address {...address} bind:selected={selectedAddresses[index]} />
			</div>
		{/each}
	</div>
{/if}
<ConfirmModal
	bind:open={deleteModalOpen}
	icon="i-mdi-warning"
	title="Delete Selected Addresses"
	message="Are you sure, you would like to delete all selected addresses and the invoices which use them?"
	on:confirm={async (e) => {
		e.detail(async () => {
			await removeAddresses(
				getSelectedFromArray($userState.addressbook, selectedAddresses).map(({ id }) => id)
			)
			selectedAddresses.fill(false)
		})
	}}
/>
