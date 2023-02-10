<script lang="ts" context="module">
	export const editInvoiceModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Button from '$/components/base/Button.svelte'

	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import Select from '$/components/base/Select.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { appState, offlineMode, userState } from '$/stores'
	import { entitySchema, invoiceSchema, resultSchema } from '$/types'
	import type z from 'zod'
	import { addNewAddressModalOpen } from './AddNewAddressModal.svelte'

	const formSchema = invoiceSchema
	let formData: z.infer<typeof formSchema> = formSchema.parse({})
	let processingEdit: boolean = false
	const fetcher = createFetcher(fetch)

	$: selectedInvoice = $userState.invoices.find(({ id }) => id === $appState.selectedInvoiceId)

	async function onOpen() {
		if (!selectedInvoice) return
		formData = invoiceSchema.parse(selectedInvoice)
		if ($offlineMode) return
		const result = await fetcher(resultSchema(entitySchema.array()), '/api/v1/private/entities')
		if (result.success) $userState.addressbook = result.data
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		if ($userState.addressbook.length < 2) {
			toast(
				'INVALID_DATA',
				'You must have at least two addresses before you can create an invoice.',
				{ type: 'error', duration: 5000 }
			)
			return
		}
		const schema = formSchema
			.refine((data) => data.senderId !== -1n, { message: 'Choose a sender' })
			.refine((data) => data.recipientId !== -1n, { message: 'Choose a recipient' })
			.refine(
				(data) =>
					(data.senderId === -1n && data.recipientId === -1n) || data.recipientId !== data.senderId,
				{
					message: 'Recipient and Sender cannot be same'
				}
			)
		if ($appState.selectedInvoiceId) {
			const result = schema.safeParse(formData)
			if (!result.success) {
				for (const error of result.error.errors) {
					toast('INVALID_DATA', error.message, { type: 'error', duration: 5000 })
				}
				return
			}
			processingEdit = true
			const result2 = await editInvoice(result.data).finally(() => (processingEdit = false))
			if (!result2.success) {
				toast(result2.error.code, result2.error.message, { type: 'error', duration: 5000 })
			}
		}
		$editInvoiceModalOpen = false
		$appState.drawerVisible = false
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

<Modal bind:open={$editInvoiceModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Edit Item</h3>
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
				on:input={(e) => {
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
				on:input={(e) => {
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
			<button type="button" on:click={() => ($editInvoiceModalOpen = false)} class="btn btn-ghost"
				>Cancel</button
			>
			<Button icon="i-mdi-floppy" class="btn-primary" processing={processingEdit}>Save</Button>
		</div>
	</form>
</Modal>
