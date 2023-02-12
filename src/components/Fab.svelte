<script lang="ts">
	import { appState, type TAction } from '$/stores'
	import { navigating } from '$app/stores'

	export let actions: TAction[]
	let fabOpen: boolean = false

	$: open = $appState.mode === 'selection' || fabOpen

	$: if ($navigating) {
		fabOpen = false
	}
</script>

<div transition:scale={{ duration: 250 }} class="fixed bottom-0 right-0 lg:hidden p-5 z-30">
	<div class="flex flex-col-reverse items-end gap-3">
		<button
			class="p-5 grid place-content-center bg-stone-800 shadow-lg rounded-xl transition hover:bg-stone-700 focus:bg-stone-700 preserve-3d"
			class:rotate-90={open}
			class:bg-stone-700={open}
			class:bg-stone-800={!open}
			on:click={() => {
				if ($appState.mode === 'selection') {
					$appState.selectedItems = $appState.selectedItems.fill(false)
					return
				}
				fabOpen = !fabOpen
			}}
		>
			<span class="{open ? 'i-mdi-close' : 'i-mdi-menu'} text-xl" />
		</button>
		<div class="flex flex-col-reverse gap-3">
			{#each [...(open ? actions : [])].reverse() as { id, color, icon, label, action, noClose }, index (id)}
				<button
					type="button"
					out:fly={{ duration: 100, delay: 50 * (actions.length - index), y: 10 * index }}
					in:fly={{ duration: 100, delay: 50 * index, y: 10 * (actions.length - index) }}
					class="btn {color} shadow-lg rounded-xl transition-transform flex gap-3 items-center justify-start"
					on:click={() => {
						action()
						if ($appState.mode === 'selection') return
						if (!noClose) {
							fabOpen = false
						}
					}}
				>
					<span class="{icon} text-xl" />
					<span>
						{label}
					</span>
				</button>
			{/each}
		</div>
	</div>
</div>
