<script context="module" lang="ts">
	interface Options {
		title?: string
		icon?: string
		initialValue?: string
		message: string
	}

	const open = writable<boolean>(false)
	const title = writable<string>('')
	const message = writable<string>('')
	const icon = writable<string>('')
	const input = writable<string>('')
	let resolve: ((value: string | undefined) => void) | undefined

	export async function prompt(opts: Options): Promise<string | undefined> {
		title.set(opts.title || '')
		message.set(opts.message)
		icon.set(opts.icon || '')
		input.set(opts.initialValue || '')
		open.set(true)
		return new Promise<string | undefined>((res) => (resolve = res))
	}
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'

	let inputElement!: HTMLInputElement
</script>

<Modal
	bind:open={$open}
	on:open={() => tick().then(() => inputElement.setSelectionRange(0, inputElement.value.length))}
	on:close={() => {
		if (!resolve) return

		resolve(undefined)
		resolve = undefined
	}}
>
	<form
		method="dialog"
		class="flex flex-col gap-5"
		on:submit={() => {
			if (!resolve) return
			resolve($input)
			resolve = undefined
		}}
	>
		<h3 class="font-bold text-xl flex gap-5 items-center">
			{#if title}
				{#if $icon}
					<span class="{$icon} text-2xl text-stone-400" />
				{/if}
				<span>
					{$title}
				</span>
			{/if}
		</h3>
		<Input id="prompt" label={$message} bind:value={$input} bind:inputElement />
		<div class="modal-action">
			<button type="submit" class="btn btn-primary flex gap-1 items-center">
				<span class="i-mdi-check text-lg" />
				Ok
			</button>
		</div>
	</form>
</Modal>
