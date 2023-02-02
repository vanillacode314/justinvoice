<script lang="ts">
	let dialogElement: HTMLDialogElement
	export let open: boolean = false

	const dispatch = createEventDispatcher()

	$: if (dialogElement) {
		open ? dialogElement.showModal() : dialogElement.close()
	}

	$: tick().then(() => dispatch(open ? 'open' : 'close'))

	$: open && tick().then(() => fadeIn(dialogElement))
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialogElement}
	on:close={() => (open = false)}
	class="bg-transparent backdrop:bg-white/10 backdrop:backdrop-blur-sm w-full max-w-full h-full p-0 m-0"
>
	<div
		class="h-full flex md:items-center md:justify-center items-end p-0 m-0"
		on:click={(e) => e.currentTarget === e.target && dialogElement.close()}
	>
		<div class="bg-stone-900 p-5 md:rounded-2xl shadow-lg w-full md:mx-auto md:max-w-xl">
			<slot />
		</div>
	</div>
</dialog>
