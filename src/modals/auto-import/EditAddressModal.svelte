<script lang="ts" context="module">
	export const editAddressModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Button from '$/components/base/Button.svelte'
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { appState, userState } from '$/stores'
	import { entitySchema } from '$/types'

	let formData: TEntity = entitySchema.parse({})
	let processingEdit: boolean = false

	$: selectedAddress = $userState.addressbook.find(({ id }) => id === $appState.selectedAddressId)

	function onOpen() {
		if (!selectedAddress) return
		formData = entitySchema.parse(selectedAddress)
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		processingEdit = true
		if ($appState.selectedAddressId) {
			const address = entitySchema.parse({ ...formData, id: $appState.selectedAddressId })
			const result = await editAddress(address).finally(() => (processingEdit = false))
			if (!result.success) {
				toast(result.error.code, result.error.message, { type: 'error', duration: 5000 })
			}
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
			<Button class="btn-primary" processing={processingEdit} icon="i-mdi-floppy">Save</Button>
		</div>
	</form>
</Modal>
