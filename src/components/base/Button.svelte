<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface $$Props extends HTMLButtonAttributes {
		processing?: boolean
		processingLabel?: string
		icon?: string
		href?: string
	}

	export let processing: boolean = false
	export let processingLabel: string = 'Working on it'
	export let icon: string = ''
	let [{ class: className }, restProps] = pullKeys($$restProps, ['class'])
</script>

<svelte:element
	this={$$props.href ? 'a' : 'button'}
	href={$$props.href}
	class="{className} btn flex gap-1 items-center"
	on:click
	{...restProps}
>
	{#if processing}
		<div class="animate-spin preserve-3d">
			<span class="i-mdi:dots-circle" />
		</div>
		<slot name="processing">
			<span>{processingLabel}</span>
		</slot>
	{:else}
		{#if icon}
			<span class="{icon} text-lg" />
		{/if}
		<slot />
	{/if}
</svelte:element>
