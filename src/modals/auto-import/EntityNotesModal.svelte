<script lang="ts" context="module">
	export const entityNotesModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Button from '$/components/base/Button.svelte'
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { appState, userState } from '$/stores'

	$: address = $userState.addressbook.find((address) => address.id === $appState.selectedAddressId)
	let processing: boolean = false
	let notes: string = ''

	function onOpen() {
		if (!address) return
		notes = address.notes
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		processing = true
		if (address) {
			await editAddress({ ...address, notes }).finally(() => (processing = false))
		}
		$entityNotesModalOpen = false
	}
</script>

<Modal bind:open={$entityNotesModalOpen} on:open={onOpen}>
	<form method="dialog" class="flex flex-col gap-5" on:submit={onSubmit}>
		<h3 class="font-bold text-xl flex gap-5 items-center">
			<span class="i-mdi-notes text-2xl text-stone-400" />
			<span>Notes</span>
		</h3>
		<Input id="notes" textarea bind:value={notes} />
		<div class="modal-action">
			<Button class="btn-ghost" type="button" on:click={() => ($entityNotesModalOpen = false)}
				>Close</Button
			>
			<Button {processing} type="submit" class="btn-primary" icon="i-mdi-floppy">Save</Button>
		</div>
	</form>
</Modal>
