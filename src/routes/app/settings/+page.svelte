<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Select from '$/components/base/Select.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { userState, userStateSchema } from '$/stores'
	import { entitySchema, invoiceSchema, type TEntity, type TInvoice } from '$/types'

	/// STATE ///
	import { onMount } from 'svelte'
	let defaultSender: TEntity['id'] = entitySchema.parse({}).id
	let defaultCurrency: TInvoice['currency'] = invoiceSchema.parse({}).currency

	/// METHODS ///
	function onChange() {
		Object.assign($userState, { defaultSender, defaultCurrency })
		$userState = $userState
	}

	function clearData() {
		$userState = userStateSchema.parse({})
	}

	/// LIFECYCLE HOOKS ///
	onMount(() => {
		defaultSender = $userState.defaultSender || ''
		defaultCurrency = $userState.defaultCurrency || 'USD'
	})
</script>

<div class="p-5 flex flex-col gap-5">
	<Input
		label="Default Currency"
		id="default-title"
		type="text"
		name="title"
		placeholder="Type here"
		required
		bind:value={defaultCurrency}
		on:input={onChange}
	/>
	<Select
		label="Default Sender"
		required
		id="invoice-sender"
		name="sender"
		bind:value={defaultSender}
		on:change={onChange}
	>
		<option value="" selected disabled>Pick a sender</option>
		{#each $userState.addressbook as { id, name } (id)}
			<option value={id}>{name}</option>
		{/each}
	</Select>
	<ConfirmModal
		title="Delete all data?"
		message="Are you sure you would like to delete all data?"
		icon="i-mdi-warning"
		on:confirm={clearData}
	>
		<button class="btn btn-error">Clear Data</button>
	</ConfirmModal>
</div>
