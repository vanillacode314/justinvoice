<script lang="ts">
	let dialogElement: HTMLDialogElement
	export let open: boolean = false
	let openedOnce: boolean = false

	const dispatch = createEventDispatcher()

	$: if (dialogElement) {
		open ? dialogElement.showModal() : dialogElement.close()
	}

	$: if (openedOnce) dispatch(open ? 'open' : 'close')
	$: open && tick().then(() => fadeIn(dialogElement))
	$: if (!openedOnce) {
		openedOnce = open
	}

	let mouseDown: boolean = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialogElement}
	on:close={() => (open = false)}
	class="bg-transparent backdrop:bg-white/10 w-full max-w-full h-full p-0 m-0"
>
	<div
		class="h-full flex md:items-center md:justify-center items-end p-0 m-0"
		on:mousedown|self={(e) => {
			mouseDown = true
		}}
		on:mouseup|self={(e) => {
			if (!mouseDown) return
			mouseDown = false
			dialogElement.close()
		}}
	>
		<div class="bg-stone-900 p-5 md:rounded-2xl shadow-lg w-full md:mx-auto md:max-w-xl">
			<slot />
		</div>
	</div>
</dialog>
