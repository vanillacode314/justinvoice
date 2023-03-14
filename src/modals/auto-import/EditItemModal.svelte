<script lang="ts" context="module">
	export const editItemModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Button from '$/components/base/Button.svelte'
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { appState, userState } from '$/stores'
	import { invoiceItemLogSchema } from '$/types'

	let formData: TInvoiceItemLog = invoiceItemLogSchema.parse({})
	let processingEdit: boolean = false

	$: selectedInvoice = $userState.invoices.find(({ id }) => id === $appState.selectedInvoiceId)
	$: selectedLog = selectedInvoice?.logs.find(({ id }) => id === $appState.selectedLogId)

	function onOpen() {
		if (!selectedLog) return
		formData = invoiceItemLogSchema.parse(selectedLog)
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		if ($appState.selectedInvoiceId && $appState.selectedLogId) {
			const entity = invoiceItemLogSchema.parse(formData)
			processingEdit = true
			const result = await editLog($appState.selectedInvoiceId, entity).finally(
				() => (processingEdit = false)
			)
			if (!result.success) {
				toast(result.error.code, result.error.message, { type: 'error', duration: 5000 })
			}
		}
		$editItemModalOpen = false
		$appState.drawerVisible = false
	}
</script>

<Modal bind:open={$editItemModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Edit Item</h3>

	<form class="flex flex-col mt-5 gap-5" method="dialog" on:submit={onSubmit}>
		<div class="flex gap-3">
			<Input
				id="item-type-goods"
				label="Goods"
				type="radio"
				name="type"
				bind:group={formData.type}
				value="GOODS"
				required
			/>
			<Input
				id="item-type-service"
				label="Service"
				required
				type="radio"
				name="type"
				bind:group={formData.type}
				value="SERVICES"
			/>
		</div>
		<Input
			label="Item Title"
			id="item-title"
			type="text"
			name="title"
			placeholder="Type here"
			required
			bind:value={formData.title}
		/>
		<Input
			textarea
			label="Item Description"
			id="item-description"
			name="description"
			placeholder="Description"
			bind:value={formData.description}
		/>
		<Input
			label="Quantity"
			id="item-qty"
			type="number"
			name="qty"
			placeholder="Type here"
			min="1"
			required
			bind:value={formData.qty}
		/>
		<Input
			label="Cost"
			id="item-cost"
			type="number"
			name="cost"
			min="0"
			step="0.01"
			placeholder="Type here"
			required
			bind:value={formData.cost}
		/>
		<div class="modal-action">
			<button type="button" class="btn btn-ghost" on:click={() => ($editItemModalOpen = false)}
				>Cancel</button
			>
			<Button class="btn-primary" icon="i-mdi-floppy" processing={processingEdit}>
				<span>Save</span>
			</Button>
		</div>
	</form>
</Modal>
