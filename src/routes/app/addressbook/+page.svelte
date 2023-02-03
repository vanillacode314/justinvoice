<script lang="ts">
	import Address from '$/components/Address.svelte'
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import { appState, userState } from '$/stores'

	onMount(() => {
		$appState.actions = [
			{
				icon: 'i-mdi-add',
				label: 'Add',
				color: 'btn-primary',
				action: () => ($addNewAddressModalOpen = true)
			}
		]
	})
	onDestroy(() => {
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
		{#each $userState.addressbook as address (address.id)}
			<Address {...address} />
		{/each}
	</div>
{/if}
