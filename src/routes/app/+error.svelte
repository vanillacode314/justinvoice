<script lang="ts">
	import Button from '$/components/base/Button.svelte'
	import { page } from '$app/stores'
	let processing: boolean = false

	$: error = $page.error!
</script>

<main class="p-10 grid h-full place-content-center gap-5 justify-items-center">
	<h1 class="uppercase font-bold text-3xl tracking-wide">An Error Occurred</h1>
	<p class="font-medium text-xl">{error.message}</p>
	<Button
		{processing}
		processingLabel="Going Home"
		on:click={() => (processing = true)}
		href="/app"
		icon="i-mdi-arrow-back"
		class="btn-lg btn-primary"
	>
		Go Home
	</Button>
</main>
