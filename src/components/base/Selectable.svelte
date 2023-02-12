<script lang="ts">
	import { appState } from '$/stores'

	interface $$Slots {
		default: {
			selected: boolean
		}
	}

	export let selected: boolean = false
</script>

<div
	class="relative grid rounded-xl overflow-hidden"
	use:longpress={{
		duration: () => ($appState.mode === 'selection' ? 10 : 1000),
		vibrate: () => ($appState.mode === 'selection' ? false : true),
		callback() {
			selected = !selected
		}
	}}
>
	{#if selected}
		<div class="absolute top-0 right-0 p-5 z-20">
			<span class="i-mdi-check-circle text-2xl" />
		</div>
		<div class="absolute inset-0 z-10 bg-black/50" />
	{/if}
	<slot {selected} />
</div>
