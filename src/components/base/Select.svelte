<script lang="ts">
	import type { ChangeEventHandler, HTMLSelectAttributes } from 'svelte/elements'
	import z from 'zod'

	interface $$Props extends Omit<HTMLSelectAttributes, 'class' | 'id'> {
		id: string
		label: string
		value: string
		options: TOption[]
	}

	interface $$Events {
		input: Parameters<ChangeEventHandler<HTMLSelectElement>>[0]
	}

	const optionsSchema = z.object({
		label: z.string().trim().optional(),
		value: z.string().trim().or(z.number()),
		disabled: z.boolean().default(false).optional(),
		selected: z.boolean().default(false).optional()
	})
	type TOption = z.infer<typeof optionsSchema>

	export let id: string
	export let label: string = ''
	export let value: string
	export let options: TOption[]
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="uppercase font-semibold text-gray-400 tracking-wider text-xs"
		>{label}</label
	>

	{#key options}
		<select
			{id}
			class="select rounded-xl select-bordered w-full invalid:select-error"
			bind:value
			on:input
			{...$$restProps}
		>
			{#each optionsSchema.array().parse(options) as { selected, disabled, label, value } (value)}
				<option {selected} {disabled} {value}>{label || value}</option>
			{/each}
		</select>
	{/key}
</div>
