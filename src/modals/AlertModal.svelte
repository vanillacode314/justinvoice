<script context="module" lang="ts">
	interface Options {
		title: string
		icon?: string
		message: string
	}

	const open = writable<boolean>(false)
	const title = writable<string>('')
	const message = writable<string>('')
	const icon = writable<string>('')

	export function alert(opts: Options) {
		title.set(opts.title)
		message.set(opts.message)
		icon.set(opts.icon || '')
		open.set(true)
	}
</script>

<script lang="ts">
	import Modal from '$/components/base/Modal.svelte'

	interface $$Slots {
		default: {
			open: () => void
		}
	}
</script>

<Modal bind:open={$open}>
	<form method="dialog" class="flex flex-col gap-5">
		<h3 class="font-bold text-xl flex gap-5 items-center">
			{#if $icon}
				<span class="{$icon} text-2xl text-stone-400" />
			{/if}
			<span>
				{$title}
			</span>
		</h3>
		<p class="whitespace-pre-wrap">{$message}</p>
		<div class="modal-action">
			<button type="submit" class="btn btn-primary flex gap-1 items-center">
				<span class="i-mdi-check text-lg" />
				Ok
			</button>
		</div>
	</form>
</Modal>
