<script lang="ts">
	const modals = import.meta.glob('$modals/*.svelte', { eager: true, import: 'default' });
	import AppShell from '$components/AppShell.svelte';
	import { theme } from '$stores/app';

	import '../app.css';
	$: console.log('theme set', $theme);
</script>

<AppShell>
	<slot />
</AppShell>

{#each Object.values(modals) as modal}
	<svelte:component this={modal} />
{/each}
