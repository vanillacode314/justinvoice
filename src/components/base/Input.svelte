<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface $$Props extends Omit<HTMLInputAttributes, 'class' | 'id'> {
		id: string
		label: string
		textarea?: boolean
		group?: string | string[]
		value: string | number
	}

	$: type = $$restProps.type

	export let id: string
	export let label: string = ''
	export let textarea: boolean = false
	export let group: string | string[] = type === 'checkbox' ? [] : ''
	export let value: string | number

	let inputElement!: HTMLInputElement
</script>

<div
	class="flex"
	class:flex-col={!['checkbox', 'radio'].includes(type)}
	class:gap-1={!['checkbox', 'radio'].includes(type)}
	class:flex-row-reverse={['checkbox', 'radio'].includes(type)}
	class:gap-2={['checkbox', 'radio'].includes(type)}
	class:items-center={['checkbox', 'radio'].includes(type)}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<label
		for={id}
		class="uppercase font-semibold text-gray-400 tracking-wider text-xs cursor-pointer"
		on:click={() => {
			if (['checkbox', 'radio'].includes(type)) {
				inputElement.click()
			}
		}}>{label}</label
	>
	{#if textarea}
		<textarea
			on:input
			{id}
			bind:value
			class={'textarea textarea-bordered rounded-xl'}
			{...$$restProps}
		/>
	{:else if type === 'radio'}
		<input
			bind:this={inputElement}
			{id}
			{value}
			type="radio"
			checked={group === value}
			on:change={(e) => {
				if (e.currentTarget.checked) group = e.currentTarget.value
			}}
			class="radio"
			{...$$restProps}
		/>
	{:else if type === 'checkbox'}
		<input
			{id}
			{value}
			bind:this={inputElement}
			type="checkbox"
			checked={group.includes(String(value))}
			on:change={(e) => {
				if (!Array.isArray(group)) group = []

				if (group.includes(e.currentTarget.value)) {
					group.splice(group.indexOf(e.currentTarget.value), 1)
					return
				}

				group.push(e.currentTarget.value)
			}}
			class="checkbox"
			{...$$restProps}
		/>
	{:else}
		<input
			{value}
			on:input={(e) => {
				if (type === 'number') {
					value = +e.currentTarget.value
					return
				}
				value = e.currentTarget.value
			}}
			on:input
			bind:this={inputElement}
			{id}
			class={textarea
				? 'textarea textarea-bordered rounded-xl'
				: 'input rounded-xl input-bordered w-full invalid:input-error'}
			{...$$restProps}
		/>
	{/if}
</div>
