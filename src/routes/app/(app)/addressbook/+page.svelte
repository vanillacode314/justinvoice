<script lang="ts">
	import Address from '$/components/Address.svelte'
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { actionSchema, appState, userState } from '$/stores'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'

	let selectedAddresses: boolean[] = []
	let deleteModalOpen: boolean = false

	$: addressbook = $userState.offlineMode ? $userState.addressbook : $page.data.data.addressbook

	$: $appState.selectionMode = selectedAddresses.some((val) => val === true)
	$: selectedAddresses.length = $userState.addressbook.length

	$: $appState.actions = actionSchema.array().parse(
		$appState.selectionMode
			? [
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

{#if addressbook.length === 0}
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
		{#each addressbook as address, index (address.id)}
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
	on:confirm={async () => {
		const addresses = $userState.addressbook.filter(
			(_address, index) => selectedAddresses[index] === true
		)
		await removeAddresses(addresses.map(({ id }) => id))
		await invalidateAll()
		selectedAddresses.fill(false)
	}}
/>
