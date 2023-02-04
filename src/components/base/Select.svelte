<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'

	interface $$Props extends Omit<HTMLSelectAttributes, 'class' | 'id'> {
		id: string
		label: string
		value: string
	}

	export let id: string
	export let label: string = ''
	export let value: string
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="uppercase font-semibold text-gray-400 tracking-wider text-xs"
		>{label}</label
	>

	<select
		{id}
		bind:value
		class="select rounded-xl select-bordered w-full invalid:select-error"
		on:change
		{...$$restProps}
	>
		<slot />
	</select>
</div>
