<script lang="ts">
	import { invoices, selectedInvoice } from '$stores/app';

	import { type Address } from '$utils/address';
	import { GOODS, type Item } from '$utils/invoice';

	/// STATE ///
	export let id: Item['id'];
	export let type: Item['type'];
	export let title: Item['title'];
	export let qty: Item['qty'];
	export let price: Item['price'];
	export let currency: Item['currency'];
	export let description: Item['description'];

	/// METHODS ///
	function removeItem() {
		if ($selectedInvoice) {
			$selectedInvoice.items = $selectedInvoice.items.filter((i) => i.id !== id);
		}
		$invoices = $invoices;
	}
</script>

<div class="card max-w-96 bg-base-100 shadow-xl border border-gray-700 overflow-visible">
	<div class="card-body">
		<h2 class="card-title">
			<span>{title}</span>
			<div class="grow" />
			<div class="badge badge-outline">
				{type === GOODS ? 'Goods' : 'Service'}
			</div>
		</h2>
		<p class="flex gap-1 items-center">
			<span>Quantity:</span><span class="font-bold">
				{qty}
			</span>
		</p>
		<p class="flex gap-1 items-center">
			<span>Price:</span><span class="font-bold">
				{price}
				{currency}
			</span>
		</p>
		<p class="flex gap-1 items-center">
			<span>Subtotal:</span><span class="font-bold">
				{price} &times; {qty} = {price * qty}
				{currency}
			</span>
		</p>
		<!-- <p> -->
		<!-- 	{description} -->
		<!-- </p> -->
		<div class="card-actions justify-end">
			<button class="btn btn-error btn-sm" on:click={removeItem}>Remove</button>
		</div>
	</div>
</div>
