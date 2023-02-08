<script lang="ts">
	import Button from '$/components/base/Button.svelte'

	type ProcessConfirm = <T>(callback: () => Promise<T>, label?: string) => Promise<T>
	interface $$Slots {
		default: {
			open: () => void
		}
	}

	interface $$Events {
		confirm: CustomEvent<ProcessConfirm>
		cancel: CustomEvent<never>
	}
	type Dispatcher<TEvents extends Record<keyof TEvents, CustomEvent<any>>> = {
		[Property in keyof TEvents]: TEvents[Property]['detail']
	}
	const dispatch = createEventDispatcher<Dispatcher<$$Events>>()

	import Modal from '$/components/base/Modal.svelte'

	export let open: boolean = false
	export let title: string
	export let message: string
	export let icon: string = ''
	export let processing: string = ''

	const processConfirm: ProcessConfirm = (callback, label = 'Working on it') => {
		processing = label
		return callback()
			.then((val) => {
				open = false
				return val
			})
			.finally(() => (processing = ''))
	}
</script>

<Modal bind:open>
	<form
		method="dialog"
		class="flex flex-col gap-5"
		on:submit|preventDefault={() => dispatch('confirm', processConfirm)}
	>
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
			<Button type="submit" class="btn-primary" processing={!!processing} icon="i-mdi-check"
				>Confirm</Button
			>
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
<form on:submit|preventDefault={() => (open = true)} class="contents">
	<slot open={() => (open = true)} />
</form>
