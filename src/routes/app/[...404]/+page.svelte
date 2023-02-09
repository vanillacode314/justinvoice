<script lang="ts">
	import Button from '$/components/base/Button.svelte'
	let processing: boolean = false
</script>

<main class="p-10 grid h-full place-content-center gap-5 justify-items-center">
	<h1 class="uppercase font-bold text-3xl tracking-wide">Page Not Found</h1>
	<Button
		{processing}
		processingLabel="Going Home"
		on:click={() => (processing = true)}
		href="/app"
		icon="i-mdi-arrow-back"
		class="btn-lg btn-primary">Go Home</Button
	>
</main>
