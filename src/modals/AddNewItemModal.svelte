<script lang="ts">
	import { addItem, GOODS, SERVICE, type INVOICE_ITEM_TYPE } from '$utils/invoice';

	/// COMPONENTS ///
	import Modal from '$components/base/Modal.svelte';

	/// STATE ///
	import { invoices, selectedInvoice, sidebarOpen } from '$stores/app';
	import { addNewItemModal } from '$stores/modals';
	let resetBtn: HTMLInputElement;
	let title: string;
	let description: string;
	let type: INVOICE_ITEM_TYPE;
	let qty: number;
	let price: number;
	let currency: string;
	let form: HTMLFormElement;

	/// METHODS ///
	function focusForm() {
		const inp = form.querySelector('input');
		if (inp) inp.focus();
	}

	function resetForm() {
		resetBtn.click();
	}

	function onSubmit() {
		if ($selectedInvoice) {
			addItem($selectedInvoice.id, title, type, price, currency, qty, description);
			$selectedInvoice = $selectedInvoice;
		}
		$addNewItemModal = false;
		$invoices = $invoices;
	}
</script>

<Modal
	id="add-new-item-modal"
	bind:open={$addNewItemModal}
	on:close={resetForm}
	on:open={focusForm}
>
	<h3 class="font-bold text-lg">Add New Item</h3>
	<form class="flex flex-col" on:submit|preventDefault={onSubmit} bind:this={form}>
		<div class="form-control w-full gap-1">
			<div class="flex">
				<label class="label cursor-pointer gap-3">
					<span class="label-text">Goods</span>
					<input
						type="radio"
						name="type"
						class="radio checked:bg-blue-500"
						bind:group={type}
						value={GOODS}
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
						bind:group={type}
						value={SERVICE}
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
				bind:value={title}
			/>
			<label for="item-description" class="label">
				<span class="label-text">Item Description</span>
			</label>
			<textarea
				id="item-description"
				name="description"
				class="textarea textarea-bordered"
				placeholder="Description"
				bind:value={description}
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
				bind:value={qty}
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
				bind:value={price}
			/>
			<label for="item-currency" class="label">
				<span class="label-text">Currency</span>
			</label>
			<input
				id="item-currency"
				type="text"
				name="currency"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={currency}
			/>
		</div>
		<div class="modal-action">
			<label for="add-new-item-modal" class="btn btn-ghost">Cancel</label>
			<button class="btn btn-success">Add</button>
		</div>
		<input class="hidden" type="reset" bind:this={resetBtn} />
	</form>
</Modal>
