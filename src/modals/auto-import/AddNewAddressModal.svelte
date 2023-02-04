<script lang="ts" context="module">
	export const addNewAddressModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { appState } from '$/stores'
	import { entitySchema, type TEntity } from '$/types'
	import { addAddress } from '$/utils/address'

	let formData: TEntity = entitySchema.parse({})

	function onOpen() {
		formData = entitySchema.parse({})
	}

	/// METHODS ///
	function onSubmit() {
		const data = entitySchema.parse(formData)
		const { id } = addAddress(data.name, data.address)
		$appState.selectedAddressId = id
		$appState.drawerVisible = false
		$appState = $appState
	}
</script>

<Modal bind:open={$addNewAddressModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Add New Address</h3>
	<form class="flex flex-col gap-5 mt-5" method="dialog" on:submit={onSubmit}>
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
			<button type="button" on:click={() => ($addNewAddressModalOpen = false)} class="btn btn-ghost"
				>Cancel</button
			>
			<button class="btn btn-success">Create</button>
		</div>
	</form>
</Modal>
