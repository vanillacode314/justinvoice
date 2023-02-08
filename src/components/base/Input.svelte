<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface $$Props extends Omit<HTMLInputAttributes, 'class' | 'id'> {
		id: string
		label: string
		textarea?: boolean
		group?: string | string[]
		value?: string | number
		type?: string
	}

	export let id: string
	export let label: string = ''
	export let textarea: boolean = false
	export let type: string = 'text'
	export let group: string | string[] = type === 'checkbox' ? [] : ''
	export let value: string | number = ''

	export let inputElement!: HTMLInputElement
	let showPassword: boolean = false
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
			if (type === 'radio') {
				inputElement.click()
			} else if (type === 'checkbox') {
				$$restProps.checked = inputElement.checked
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
			on:change
			class="radio"
			{...$$restProps}
		/>
	{:else if type === 'checkbox'}
		<input
			{id}
			{value}
			bind:this={inputElement}
			type="checkbox"
			checked={$$restProps.checked}
			on:change={(e) => {
				if (!Array.isArray(group)) group = []

				$$restProps.checked = e.currentTarget.checked
				if (group.includes(e.currentTarget.value)) {
					group.splice(group.indexOf(e.currentTarget.value), 1)
				} else {
					group.push(e.currentTarget.value)
				}
			}}
			on:change
			class="checkbox"
			{...$$restProps}
		/>
	{:else if type === 'password'}
		<div class="relative">
			<input
				{value}
				on:input={(e) => (value = e.currentTarget.value)}
				type={showPassword ? 'text' : 'password'}
				on:input
				bind:this={inputElement}
				{id}
				class="input rounded-xl input-bordered w-full invalid:input-error"
				{...$$restProps}
			/>
			<button
				type="button"
				on:click={() => (showPassword = !showPassword)}
				class="absolute btn-circle btn-sm btn-ghost inset-y-1/2 -translate-y-1/2 right-3 text-lg grid place-content-center"
			>
				<span class:i-mdi-eye={!showPassword} class:i-mdi-eye-off={showPassword} />
			</button>
		</div>
	{:else}
		<input
			{value}
			{type}
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
			class="input rounded-xl input-bordered w-full invalid:input-error"
			{...$$restProps}
		/>
	{/if}
</div>
