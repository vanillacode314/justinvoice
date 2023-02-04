<script lang="ts" context="module">
	export const editAddressModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { appState, userState } from '$/stores'
	import { entitySchema, type TEntity } from '$/types'

	let formData: TEntity = entitySchema.parse({})

	$: selectedAddress = $userState.addressbook.find(({ id }) => id === $appState.selectedAddressId)

	function onOpen() {
		if (!selectedAddress) return
		formData = entitySchema.parse(selectedAddress)
	}

	function onSubmit() {
		if (selectedAddress) {
			const { name, address } = entitySchema.parse(formData)
			selectedAddress.name = name
			selectedAddress.address = address
			$userState = $userState
		}
		$editAddressModalOpen = false
		$appState.drawerVisible = false
	}
</script>

<Modal bind:open={$editAddressModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Edit Address</h3>
	<form class="flex flex-col mt-5 gap-5" method="dialog" on:submit={onSubmit}>
		<Input
			id="addressbook-name"
			label="Name"
			type="text"
			name="name"
			placeholder="Type here"
			required
			bind:value={formData.name}
		/>
		<Input
			id="addressbook-address"
			label="Address"
			type="text"
			name="address"
			placeholder="Type here"
			required
			bind:value={formData.address}
		/>
		<div class="modal-action">
			<button type="button" class="btn btn-ghost" on:click={() => ($editAddressModalOpen = false)}
				>Cancel</button
			>
			<button class="flex gap-1 items-center btn btn-success">
				<span class="i-mdi-floppy text-lg" />
				<span>Save</span>
			</button>
		</div>
	</form>
</Modal>
