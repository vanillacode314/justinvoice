<script lang="ts" context="module">
	export const editAddressModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
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
	<form class="flex flex-col" method="dialog" on:submit={onSubmit}>
		<div class="form-control w-full gap-1">
			<label for="addressbook-name" class="label">
				<span class="label-text">Name</span>
			</label>
			<input
				id="addressbook-name"
				type="text"
				name="name"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={formData.name}
			/>
			<label for="addressbook-address" class="label">
				<span class="label-text">Address</span>
			</label>
			<input
				id="addressbook-address"
				name="address"
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={formData.address}
			/>
		</div>
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
