<script lang="ts">
	import type { Address } from '$utils/address';
	/// STATE ///
	import { addressbook, settings } from '$stores/app';
	import { onMount } from 'svelte';
	let defaultSender: Address['id'] = -1;

	/// METHODS ///
	function onSubmit() {
		$settings.defaultSender = defaultSender;
		$settings = $settings;
	}

	/// LIFECYCLE HOOKS ///
	onMount(() => {
		defaultSender = $settings.defaultSender;
	});
</script>

<form on:submit|preventDefault={onSubmit}>
	<label for="invoice-sender" class="label">
		<span class="label-text">Default Sender's Address</span>
	</label>
	<select
		class="select select-bordered w-full invalid:select-error"
		required
		id="invoice-sender"
		name="sender"
		bind:value={defaultSender}
	>
		<option value={null} selected>Pick an address</option>
		{#each $addressbook as { id, name } (id)}
			<option value={id}>{name}</option>
		{/each}
	</select>
	<div class="grow" />
	<div class="flex justify-end mt-1">
		<button class="btn btn-success btn-sm">Save</button>
	</div>
</form>

<style>
	form {
		width: 100%;
		height: 100%;
		max-inline-size: 1080px;
		margin-inline: auto;
		align-content: start;
		padding: 1rem;
		gap: 0.5rem;
		display: flex;
		flex-direction: column;
	}
</style>
