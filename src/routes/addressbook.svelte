<script lang="ts">
	import Address from '$components/Address.svelte';
	import { addressbook } from '$stores/app';
</script>

<div class="p-5 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
	{#each $addressbook as address (address.id)}
		<Address {...address} />
	{/each}
</div>
