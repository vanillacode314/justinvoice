<script lang="ts" context="module">
	export const addNewItemModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Button from '$/components/base/Button.svelte'

	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { appState } from '$/stores'
	import { invoiceItemLogSchema } from '$/types'

	let formData: TInvoiceItemLog = invoiceItemLogSchema.parse({})
	let processingCreation: boolean = false

	function onOpen() {
		formData = invoiceItemLogSchema.parse({})
	}

	async function onSubmit(e: SubmitEvent) {
		if (!$appState.selectedInvoiceId) return
		e.preventDefault()
		processingCreation = true
		const result = invoiceItemLogSchema.safeParse(formData)
		if (!result.success) {
			for (const error of result.error.errors) {
				toast('INVALID_DATA', error.message, { type: 'error', duration: 5000 })
			}
			processingCreation = false
			return
		}
		const result2 = await addLogs($appState.selectedInvoiceId, result.data).finally(
			() => (processingCreation = false)
		)
		if (!result2.success) {
			toast(result2.error.code, result2.error.message, { type: 'error', duration: 5000 })
			return
		}
		$addNewItemModalOpen = false
	}
</script>

<Modal bind:open={$addNewItemModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Add New Item</h3>
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
			<button type="button" class="btn btn-ghost" on:click={() => ($addNewItemModalOpen = false)}
				>Cancel</button
			>
			<Button processing={processingCreation} class="btn-primary">
				<span>Add</span>
			</Button>
		</div>
	</form>
</Modal>
