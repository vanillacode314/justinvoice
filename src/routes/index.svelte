<script lang="ts">
	import Invoice from '$components/Invoice.svelte';
	import { invoices } from '$stores/app';
	import { onMount } from 'svelte';

	onMount(() => {
		for (const invoice of $invoices) {
			if (!Object.hasOwn(invoice, 'senderID')) {
				invoice.senderID = invoice.sender.id;
			}
			if (!Object.hasOwn(invoice, 'recipientID')) {
				invoice.recipientID = invoice.recipient.id;
			}
		}
		$invoices = $invoices;
	});
</script>

<div class="p-5 grid gap-5" id="invoice-grid">
	{#each $invoices as invoice (invoice.id)}
		<Invoice {...invoice} />
	{/each}
</div>

<style>
	#invoice-grid {
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
</style>
