<script lang="ts" context="module">
	export const filterModalOpen = writable<boolean>(false)
</script>

<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Modal from '$/components/base/Modal.svelte'
	import Select from '$/components/base/Select.svelte'
	import { appState, appStateSchema } from '$/stores'
	import { invalidate } from '$app/navigation'
	import type { Writable } from 'svelte/store'

	const loading = getContext<Writable<boolean>>('loading')

	const fetcher = createFetcher(fetch)
	let processing: boolean = false
	const formSchema = appStateSchema.shape.invoiceFilters
	let formData = formSchema.parse({})

	function onOpen() {
		formData = formSchema.parse($appState.invoiceFilters)
	}

	/// METHODS ///
	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		$filterModalOpen = false
		$loading = true
		$appState.invoiceFilters = formData
		$appState = $appState
		await invalidate('filter').finally(() => {
			$loading = false
		})
		processing = false
	}
</script>

<Modal bind:open={$filterModalOpen} on:open={onOpen}>
	<h3 class="font-bold text-lg">Add New Address</h3>
	<form class="flex flex-col gap-5 mt-5" method="dialog" on:submit={onSubmit}>
		<Select
			id="filters-paid"
			label="Payment Status"
			name="paid"
			placeholder="Payment Status"
			required
			value={String(formData.paid)}
			options={[
				{ label: 'Paid', value: 'true' },
				{ label: 'Unpaid', value: 'false' },
				{ label: 'All', value: 'null' }
			]}
			on:input={(e) => {
				switch (e.currentTarget.value) {
					case 'true':
						formData.paid = true
						break
					case 'false':
						formData.paid = false
						break
					case 'null':
						formData.paid = null
						break
				}
			}}
		/>
		<Input
			id="filters-query"
			label="Query (Blank for all)"
			name="queyr"
			placeholder="E.g. Web Development"
			value={formData.query ?? ''}
			on:input={(e) => {
				const value = e.currentTarget.value
				if (!value) {
					formData.query = null
					return
				}
				formData.query = value
			}}
		/>
		<div class="modal-action">
			<button type="button" on:click={() => ($filterModalOpen = false)} class="btn btn-ghost"
				>Cancel</button
			>
			<button type="submit" class="btn btn-primary flex gap-1 items-center">
				{#if processing}
					<div class="animate-spin preserve-3d">
						<span class="i-mdi:dots-circle" />
					</div>
					<span>Working on it</span>
				{:else}
					<span class="i-mdi-filter text-lg" />
					Apply
				{/if}
			</button>
		</div>
	</form>
</Modal>
