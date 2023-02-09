<script lang="ts">
	import { appState, type TAction } from '$/stores'
	import { navigating } from '$app/stores'

	export let actions: TAction[]
	let fabOpen: boolean = false

	$: open = $appState.selectionMode || fabOpen

	$: if ($navigating) {
		fabOpen = false
	}
</script>

<div transition:scale={{ duration: 250 }} class="fixed bottom-0 right-0 lg:hidden p-5 z-30">
	<div class="flex flex-col-reverse items-center gap-3">
		<button
			class="p-5 grid place-content-center bg-stone-800 shadow-lg rounded-full transition hover:bg-stone-700 focus:bg-stone-700 preserve-3d"
			class:rotate-90={open}
			class:bg-stone-700={open}
			class:bg-stone-800={!open}
			on:click={() => {
				if ($appState.selectionMode) return
				fabOpen = !fabOpen
			}}
		>
			<span class="{open ? 'i-mdi-close' : 'i-mdi-menu'} text-xl" />
		</button>
		<div class="flex flex-col-reverse items-center gap-3">
			{#each [...(open ? actions : [])].reverse() as { color, icon, label, action, noClose }, index (label)}
				<button
					out:fly={{ duration: 100, delay: 50 * (actions.length - index), y: 10 * index }}
					in:fly={{ duration: 100, delay: 50 * index, y: 10 * (actions.length - index) }}
					class="btn btn-circle p-3 grid place-content-center {color} shadow-lg rounded-full transition-transform"
					on:click={() => {
						action()
						if ($appState.selectionMode) return
						if (!noClose) {
							fabOpen = false
						}
					}}
				>
					<span class="{icon} text-xl" />
				</button>
			{/each}
		</div>
	</div>
</div>
