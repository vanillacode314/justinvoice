<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'

	interface $$Props extends Omit<HTMLSelectAttributes, 'class' | 'id'> {
		id: string
		label: string
	}

	export let id: string
	export let label: string = ''
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="uppercase font-semibold text-gray-400 tracking-wider text-xs"
		>{label}</label
	>

	<select
		{id}
		class="select rounded-xl select-bordered w-full invalid:select-error"
		{...$$restProps}
	>
		<slot />
	</select>
</div>
