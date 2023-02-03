<script lang="ts" context="module">
	export const createNewInvoiceModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Modal from '$/components/base/Modal.svelte'
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
		const form = e.currentTarget as HTMLFormElement
		const data = invoiceSchema.parse(formData)
		console.log(data)

		createInvoice(data.title, data.senderId, data.recipientId, data.currency)

		$appState.drawerVisible = false
		form.reset()
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
