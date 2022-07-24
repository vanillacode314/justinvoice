<script lang="ts">
	import Invoice from '$components/Invoice.svelte';
	import { invoices } from '$stores/app';
</script>

<div class="p-5 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
	{#each $invoices as invoice (invoice.id)}
		<Invoice {...invoice} />
	{/each}
</div>
