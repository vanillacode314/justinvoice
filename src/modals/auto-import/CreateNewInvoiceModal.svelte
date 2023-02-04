<script lang="ts" context="module">
	export const createNewInvoiceModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import Select from '$/components/base/Select.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import { appState, userState } from '$/stores'
	import { invoiceSchema, type TInvoice } from '$/types'

	let formData: TInvoice = invoiceSchema.parse({})

	/// METHODS ///
	function onOpen() {
		formData = invoiceSchema.parse({
			senderId: $userState.defaultSender,
			currency: $userState.defaultCurrency
		})
	}

	function onSubmit(e: SubmitEvent) {
		const result = invoiceSchema.safeParse(formData)

		if (!result.success) {
			for (const error of result.error.errors) {
				toast('Invalid Data', error.message, 'error')
			}
			e.preventDefault()
			return
		}

		const data = result.data
		createInvoice(data.title, data.senderId, data.recipientId, data.currency)

		$appState.drawerVisible = false
	}

	async function newAddress(): Promise<string> {
		$addNewAddressModalOpen = true
		let firstRun: boolean = true
		return new Promise((resolve) => {
			let unsub: () => void
			unsub = appState.subscribe(({ selectedAddressId }) => {
				if (firstRun) {
					firstRun = false
					return
				}
				unsub()
				const address = $userState.addressbook.find(({ id }) => id === selectedAddressId)
				if (!address) return
				resolve(selectedAddressId!)
			})
		})
	}
</script>

<Modal bind:open={$createNewInvoiceModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Create New Invoice</h3>
	<form class="flex flex-col gap-5 mt-5" on:submit={onSubmit} method="dialog">
		<Input
			label="Invoice Title"
			id="invoice-title"
			type="text"
			name="title"
			placeholder="Type here"
			required
			bind:value={formData.title}
		/>
		<div class="grid grid-cols-[1fr_auto] gap-3 items-end">
			<Select
				required
				id="invoice-sender"
				name="sender"
				label="Sender's Address"
				bind:value={formData.senderId}
			>
				<option value="" disabled selected>Pick an address</option>
				{#each $userState.addressbook as { id, name } (id)}
					<option value={id}>{name}</option>
				{/each}
			</Select>
			<button
				type="button"
				class="btn"
				on:click={() => newAddress().then((id) => (formData.senderId = id))}
			>
				New Address</button
			>
		</div>
		<div class="grid grid-cols-[1fr_auto] gap-3 items-end">
			<Select
				label="Recipient's Address"
				required
				name="recipient"
				id="invoice-recipient"
				bind:value={formData.recipientId}
			>
				<option value="" disabled selected>Pick an address</option>
				{#each $userState.addressbook as { id, name } (id)}
					<option value={id}>{name}</option>
				{/each}
			</Select>
			<button
				type="button"
				class="btn"
				on:click={() => newAddress().then((id) => (formData.recipientId = id))}>New Address</button
			>
		</div>
		<Input
			id="invoice-currency"
			label="Currency"
			type="text"
			name="currency"
			placeholder="Type here"
			required
			bind:value={formData.currency}
		/>
		<div class="modal-action">
			<button
				type="button"
				on:click={() => ($createNewInvoiceModalOpen = false)}
				class="btn btn-ghost">Cancel</button
			>
			<button class="flex gap-1 items-center btn btn-success">
				<span class="i-mdi-add text-lg" />
				<span>Create</span>
			</button>
		</div>
	</form>
</Modal>
