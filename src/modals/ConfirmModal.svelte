<script lang="ts">
	import Modal from '$components/base/Modal.svelte'

	interface $$Slots {
		default: {
			open: () => void
		}
	}

	export let open: boolean = false
	export let title: string
	export let message: string
	export let icon: string = ''

	const dispatch = createEventDispatcher()
</script>

<Modal bind:open>
	<form method="dialog" class="flex flex-col gap-5" on:submit={() => dispatch('confirm')}>
		<h3 class="font-bold text-xl flex gap-5 items-center">
			{#if icon}
				<span class="{icon} text-2xl text-stone-400" />
			{/if}
			<span>
				{title}
			</span>
		</h3>
		<p>{message}</p>
		<div class="modal-action">
			<button class="btn btn-primary">Confirm</button>
			<button
				type="button"
				on:click={() => {
					open = false
					dispatch('cancel')
				}}
				class="btn btn-ghost">Cancel</button
			>
		</div>
	</form>
</Modal>
<form on:submit|preventDefault={() => (open = true)}>
	<slot open={() => (open = true)} />
</form>
