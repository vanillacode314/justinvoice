<script lang="ts" context="module">
	export const addNewAddressModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { appState } from '$/stores'
	import { entitySchema } from '$/types'

	let processing: boolean = false
	let formData: TEntity = entitySchema.parse({})

	function onOpen() {
		formData = entitySchema.parse({})
	}

	/// METHODS ///
	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		processing = true
		const { name, address } = entitySchema.parse(formData)
		const { id } = await addAddress(name, address).finally(() => (processing = false))
		Object.assign($appState, { selectedAddressId: id, drawerVisible: false })
		$appState = $appState
		$addNewAddressModalOpen = false
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
			<button type="submit" class="btn btn-primary flex gap-1 items-center">
				{#if processing}
					<div class="animate-spin preserve-3d">
						<span class="i-mdi:dots-circle" />
					</div>
					<span>Working on it</span>
				{:else}
					<span class="i-mdi-check text-lg" />
					Add
				{/if}
			</button>
		</div>
	</form>
</Modal>
