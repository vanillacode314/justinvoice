<script lang="ts">
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { userState, userStateSchema } from '$/stores'
	import { entitySchema, invoiceSchema, type TEntity, type TInvoice } from '$/types'

	/// STATE ///
	import { onMount } from 'svelte'
	let defaultSender: TEntity['id'] = entitySchema.parse({}).id
	let defaultCurrency: TInvoice['currency'] = invoiceSchema.parse({}).currency

	/// METHODS ///
	function onChange() {
		$userState.defaultSender = defaultSender
		$userState.defaultCurrency = defaultCurrency
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
	<div>
		<label
			for="default-currency"
			class="label uppercase font-semibold text-gray-400 tracking-wider text-xs"
		>
			<span>Default Currency</span>
		</label>
		<input
			id="default-title"
			type="text"
			name="title"
			placeholder="Type here"
			class="input input-bordered w-full invalid:input-error"
			required
			bind:value={defaultCurrency}
			on:input={onChange}
		/>
		<label
			for="invoice-sender"
			class="label uppercase font-semibold text-gray-400 tracking-wider text-xs"
		>
			<span>Default Sender</span>
		</label>
		<select
			class="select select-bordered w-full invalid:select-error"
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
		</select>
	</div>
	<ConfirmModal
		title="Delete all data?"
		message="Are you sure you would like to delete all data?"
		icon="i-mdi-warning"
		on:confirm={clearData}
	>
		<button class="btn btn-error">Clear Data</button>
	</ConfirmModal>
</div>
