<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	const dispatch = createEventDispatcher();

	export let id: string;
	export let open: boolean = false;
	export let closeOnOutsideClick: boolean = true;

	$: tick().then(() => dispatch(open ? 'open' : 'close'));
</script>

<input
	type="checkbox"
	{id}
	class="modal-toggle"
	bind:checked={open}
	aria-hidden={!open}
	tabindex="-1"
/>
<label
	for={closeOnOutsideClick ? id : undefined}
	class="modal modal-bottom sm:modal-middle"
	class:cursor-pointer={closeOnOutsideClick}
	aria-hidden={!open}
>
	<label class="modal-box">
		<slot />
	</label>
</label>
