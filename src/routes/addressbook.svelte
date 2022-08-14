<script lang="ts">
	import Address from '$components/Address.svelte';
	import { addressbook } from '$stores/app';
</script>

<div class="p-5 grid gap-5" id="address-grid">
	{#each $addressbook as address (address.id)}
		<Address {...address} />
	{/each}
</div>

<style>
	#address-grid {
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
</style>
