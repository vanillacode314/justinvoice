<script lang="ts">
	import { navigating } from '$app/stores';

	const modals = import.meta.glob('$modals/*.svelte', { eager: true, import: 'default' });
	import AppShell from '$components/AppShell.svelte';
	import Spinner from '$components/base/Spinner.svelte';
	import { theme } from '$stores/app';

	import '../../app.css';
	$: console.log('theme set', $theme);
</script>

<AppShell>
	{#if $navigating}
		<div class="loading">
			<Spinner />
		</div>
	{:else}
		<slot />
	{/if}
</AppShell>

{#each Object.values(modals) as modal}
	<svelte:component this={modal} />
{/each}

<style>
	.loading {
		display: grid;
		place-items: center;
		padding: 1rem;
	}
</style>
