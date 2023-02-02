<script lang="ts" context="module">
	export const editItemModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Modal from '$/components/base/Modal.svelte'
	import { appState, userState } from '$/stores'
	import { invoiceItemLogSchema, type TInvoiceItemLog } from '$/types'

	let formData: TInvoiceItemLog = invoiceItemLogSchema.parse({})

	$: selectedInvoice = $userState.invoices.find(({ id }) => id === $appState.selectedInvoiceId)
	$: selectedItem = selectedInvoice?.logs.find(({ id }) => id === $appState.selectedItemId)

	function onOpen() {
		if (!selectedItem) return
		formData = invoiceItemLogSchema.parse(selectedItem)
	}

	function onSubmit() {
		if (selectedItem) {
			const { qty, cost, type, title, description } = invoiceItemLogSchema.parse(formData)
			Object.assign(selectedItem, { qty, cost, type, title, description })
			$userState = $userState
		}
		$editItemModalOpen = false
		$appState.drawerVisible = false
	}
</script>

<Modal bind:open={$editItemModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Edit Item</h3>
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
			<button class="btn btn-ghost" on:click={() => ($editItemModalOpen = false)}>Cancel</button>
			<button class="flex gap-1 items-center btn btn-success">
				<span class="i-mdi-floppy text-lg" />
				<span>Save</span>
			</button>
		</div>
	</form>
</Modal>
