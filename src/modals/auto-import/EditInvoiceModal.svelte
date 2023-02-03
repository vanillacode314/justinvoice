<script lang="ts" context="module">
	export const editInvoiceModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Modal from '$/components/base/Modal.svelte'
	import { appState, userState } from '$/stores'
	import { invoiceSchema, type TInvoice } from '$/types'
	import { addNewAddressModalOpen } from './AddNewAddressModal.svelte'

	let formData: TInvoice = invoiceSchema.parse({})

	$: selectedInvoice = $userState.invoices.find(({ id }) => id === $appState.selectedInvoiceId)

	function onOpen() {
		if (!selectedInvoice) return
		formData = invoiceSchema.parse(selectedInvoice)
	}

	function onSubmit() {
		console.log('SUBMIT')
		if (selectedInvoice) {
			const { title, currency, senderId, recipientId } = invoiceSchema.parse(formData)
			Object.assign(selectedInvoice, { title, currency, senderId, recipientId })
			$userState = $userState
		}
		$editInvoiceModalOpen = false
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

<Modal bind:open={$editInvoiceModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Edit Item</h3>
	<form class="flex flex-col" on:submit={onSubmit} method="dialog">
		<div class="form-control w-full gap-1">
			<label for="invoice-title" class="label">
				<span class="label-text">Invoice Title</span>
			</label>
			<input
				id="invoice-title"
				type="text"
				name="title"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={formData.title}
			/>
			<label for="invoice-sender" class="label">
				<span class="label-text">Sender's Address</span>
			</label>
			<div class="grid grid-cols-[1fr_auto] gap-3">
				<select
					class="select select-bordered w-full invalid:select-error"
					required
					id="invoice-sender"
					name="sender"
					bind:value={formData.senderId}
				>
					<option value="" disabled selected>Pick an address</option>
					{#each $userState.addressbook as { id, name } (id)}
						<option value={id}>{name}</option>
					{/each}
				</select>
				<button
					type="button"
					class="btn"
					on:click={() => newAddress().then((id) => (formData.senderId = id))}
				>
					New Address</button
				>
			</div>
			<label for="invoice-recipient" class="label">
				<span class="label-text">Recipient's Address</span>
			</label>
			<div class="grid grid-cols-[1fr_auto] gap-3">
				<select
					class="select select-bordered w-full invalid:select-error"
					required
					name="recipient"
					id="invoice-recipient"
					bind:value={formData.recipientId}
				>
					<option value="" disabled selected>Pick an address</option>
					{#each $userState.addressbook as { id, name } (id)}
						<option value={id}>{name}</option>
					{/each}
				</select>
				<button
					type="button"
					class="btn"
					on:click={() => newAddress().then((id) => (formData.recipientId = id))}
					>New Address</button
				>
			</div>
			<label for="invoice-currency" class="label">
				<span class="label-text">Currency</span>
			</label>
			<input
				id="invoice-currency"
				type="text"
				name="currency"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={formData.currency}
			/>
		</div>
		<div class="modal-action">
			<button type="button" on:click={() => ($editInvoiceModalOpen = false)} class="btn btn-ghost"
				>Cancel</button
			>
			<button class="flex gap-1 items-center btn btn-success">
				<span class="i-mdi-floppy text-lg" />
				<span>Save</span>
			</button>
		</div>
	</form>
</Modal>
