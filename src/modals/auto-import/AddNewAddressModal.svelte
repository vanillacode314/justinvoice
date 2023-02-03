<script lang="ts" context="module">
	export const addNewAddressModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Modal from '$/components/base/Modal.svelte'
	import { appState } from '$/stores'
	import { entitySchema, type TEntity } from '$/types'
	import { addAddress } from '$/utils/address'

	let formData: TEntity = entitySchema.parse({})

	/// METHODS ///
	function onSubmit(e: SubmitEvent) {
		const form = e.currentTarget as HTMLFormElement

		const data = entitySchema.parse(formData)
		const { id } = addAddress(data.name, data.address)
		$appState.selectedAddressId = id
		$appState.drawerVisible = false

		form.reset()
	}
</script>

<Modal bind:open={$addNewAddressModalOpen}>
	<h3 class="font-bold text-lg">Add New Address</h3>
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
			<button type="button" on:click={() => ($addNewAddressModalOpen = false)} class="btn btn-ghost"
				>Cancel</button
			>
			<button class="btn btn-success">Create</button>
		</div>
	</form>
</Modal>
