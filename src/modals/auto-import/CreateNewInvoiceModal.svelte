<script lang="ts" context="module">
	export const createNewInvoiceModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import Select from '$/components/base/Select.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import { appState, offlineMode, settings, userState } from '$/stores'
	import { entitySchema, invoiceSchema, resultSchema } from '$/types'
	import { goto } from '$app/navigation'
	import type z from 'zod'

	const fetcher = createFetcher(fetch)
	const formSchema = invoiceSchema.omit({ id: true, dateOfIssue: true, logs: true }).refine(
		(invoice) => {
			if (invoice.senderId === -1n || invoice.recipientId === -1n) return true
			return invoice.senderId !== invoice.recipientId
		},
		{
			message: 'Sender and Recipient should not be the same'
		}
	)
	let formData: z.infer<typeof formSchema> = formSchema.parse({})
	let processingCreation: boolean = false

	/// METHODS ///
	async function onOpen() {
		formData = formSchema.parse({
			senderId: $settings.defaultSender ?? -1n,
			currency: $settings.defaultCurrency
		})
		if ($offlineMode) return
		const result = await fetcher(resultSchema(entitySchema.array()), '/api/v1/private/entities')
		if (result.success) $userState.addressbook = result.data
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		processingCreation = true
		const result = formSchema.safeParse(formData)

		if (!result.success) {
			for (const error of result.error.errors) {
				toast('Invalid Data', error.message, { type: 'error', duration: 5000 })
			}
			processingCreation = false
			return
		}

		const data = result.data
		try {
			const { id } = await createInvoice(data.title, data.senderId, data.recipientId, data.currency)
			$appState.drawerVisible = false
			$createNewInvoiceModalOpen = false
			await goto(`/app/invoice/${id}`)
		} finally {
			processingCreation = false
		}
	}

	async function newAddress(): Promise<z.infer<typeof entitySchema.shape.id>> {
		$addNewAddressModalOpen = true
		return new Promise(async (resolve) => {
			const { selectedAddressId } = await getNextValue(
				appState,
				({ selectedAddressId }) => selectedAddressId
			)
			const address = $userState.addressbook.find(({ id }) => id === selectedAddressId)
			if (!address) return
			resolve(selectedAddressId!)
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
				value={String(formData.senderId)}
				on:change={(e) => {
					formData.senderId = e.currentTarget.value ? BigInt(e.currentTarget.value) : -1n
				}}
				options={[
					{ value: '-1', label: 'Pick a sender', disabled: true, selected: true },
					...$userState.addressbook.map(({ id, name }) => ({ value: String(id), label: name }))
				]}
			/>
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
				value={String(formData.recipientId)}
				on:change={(e) => {
					formData.recipientId = e.currentTarget.value ? BigInt(e.currentTarget.value) : -1n
				}}
				options={[
					{ value: '-1', label: 'Pick a recipient', disabled: true, selected: true },
					...$userState.addressbook.map(({ id, name }) => ({ value: String(id), label: name }))
				]}
			/>
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
				{#if processingCreation}
					<div class="animate-spin preserve-3d">
						<span class="i-mdi:dots-circle" />
					</div>
					<span>Working on it</span>
				{:else}
					<span class="i-mdi-add text-lg" />
					<span>Create</span>
				{/if}
			</button>
		</div>
	</form>
</Modal>
