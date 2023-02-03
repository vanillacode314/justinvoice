<script lang="ts" context="module">
	export const addNewItemModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Modal from '$/components/base/Modal.svelte'
	import { appState } from '$/stores'
	import { invoiceItemLogSchema, type TInvoiceItemLog } from '$/types'
	import { addItem } from '$/utils/invoice'

	let formData: TInvoiceItemLog = invoiceItemLogSchema.parse({})

	function onOpen() {
		formData = invoiceItemLogSchema.parse({})
	}

	function onSubmit() {
		if (!$appState.selectedInvoiceId) return

		const { title, type, cost, qty, description } = invoiceItemLogSchema.parse(formData)
		addItem($appState.selectedInvoiceId, title, type, cost, qty, description)
	}
</script>

<Modal bind:open={$addNewItemModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Add New Item</h3>
	<form class="flex flex-col" method="dialog" on:submit={onSubmit}>
		<div class="form-control w-full gap-1">
			<div class="flex">
				<label class="label cursor-pointer gap-3">
					<span class="label-text">Goods</span>
					<input
						type="radio"
						name="type"
						class="radio checked:bg-blue-500"
						bind:group={formData.type}
						value="GOODS"
						required
					/>
				</label>
				<label class="label cursor-pointer gap-3">
					<span class="label-text">Service</span>
					<input
						required
						type="radio"
						name="type"
						class="radio checked:bg-blue-500"
						bind:group={formData.type}
						value="SERVICES"
					/>
				</label>
			</div>
			<label for="item-title" class="label">
				<span class="label-text">Item Title</span>
			</label>
			<input
				id="item-title"
				type="text"
				name="title"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={formData.title}
			/>
			<label for="item-description" class="label">
				<span class="label-text">Item Description</span>
			</label>
			<textarea
				id="item-description"
				name="description"
				class="textarea textarea-bordered"
				placeholder="Description"
				bind:value={formData.description}
			/>
			<label for="item-qty" class="label">
				<span class="label-text">Quantity</span>
			</label>
			<input
				id="item-qty"
				type="number"
				name="qty"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				min="1"
				required
				bind:value={formData.qty}
			/>
			<label for="item-price" class="label">
				<span class="label-text">Price</span>
			</label>
			<input
				id="item-price"
				type="number"
				name="price"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={formData.cost}
			/>
		</div>
		<div class="modal-action">
			<button type="button" class="btn btn-ghost" on:click={() => ($addNewItemModalOpen = false)}
				>Cancel</button
			>
			<button class="btn btn-success flex gap-1 items-center">
				<span class="i-mdi-add text-lg" />
				<span>Add</span>
			</button>
		</div>
	</form>
</Modal>
