<script lang="ts">
	import Invoice from '$/components/Invoice.svelte'
	import { createNewInvoiceModalOpen } from '$/modals/auto-import/CreateNewInvoiceModal.svelte'
	import { filterModalOpen } from '$/modals/auto-import/FilterModal.svelte'
	import { prompt } from '$/modals/auto-import/PromptModal.svelte'
	import { actionSchema, appState, appStateSchema, loadingMessage, userState } from '$/stores'
	import { invalidate } from '$app/navigation'
	import { isEqual } from 'lodash-es'
	import type { Writable } from 'svelte/store'

	const loading = getContext<Writable<boolean>>('loading')

	onMount(() => {
		$appState.actions = z
			.union([z.literal('spacer'), actionSchema])
			.array()
			.parse([
				{
					icon: 'i-mdi-filter',
					label: 'Filter',
					action: () => {
						$filterModalOpen = true
					}
				},
				'spacer',
				{
					icon: 'i-mdi-import',
					label: 'Import Invoice(s)',
					action: () => {
						importInvoices(() => {
							$loadingMessage = 'Importing'
							$loading = true
						}).finally(() => ($loading = false))
					}
				},
				{
					icon: 'i-mdi-export',
					label: 'Export All',
					action: async () => {
						const name = await prompt({
							icon: 'i-mdi-export',
							title: 'Export Invoices',
							message: 'Enter filename (timestamp will be auto appended to the name):',
							initialValue: `justinvoices`
						})
						if (!name) return
						exportAll(name)
					}
				},
				{
					icon: 'i-mdi-add',
					label: 'Add',
					color: 'btn-primary',
					action: () => {
						$createNewInvoiceModalOpen = true
					}
				}
			])
	})
	onDestroy(() => {
		$appState.actions = []
	})
</script>

<div class="p-5 min-h-full grid">
	{#if $userState.filteredInvoices.length === 0 && !isEqual($appState.invoiceFilters, appStateSchema.shape.invoiceFilters.parse({}))}
		<div class="flex flex-col gap-5 items-center h-full justify-center">
			<span class="i-mdi-file-document-multiple text-6xl" />
			<h2 class="text-xl uppercase font-bold">No Invoices Found</h2>
			<button
				class="flex items-center gap-1 btn btn-success"
				on:click={async () => {
					$appState.invoiceFilters = appStateSchema.shape.invoiceFilters.parse({})
					$loading = true
					await invalidate('filter').finally(() => ($loading = false))
				}}
			>
				<span class="i-mdi-close text-lg" />
				<span>Clear Filters</span>
			</button>
		</div>
	{:else if $userState.invoices.length === 0}
		<div class="flex flex-col gap-5 items-center h-full justify-center">
			<span class="i-mdi-file-document-multiple text-6xl" />
			<h2 class="text-xl uppercase font-bold">Create your first invoice</h2>
			<button
				class="flex items-center gap-1 btn btn-success"
				on:click={() => ($createNewInvoiceModalOpen = true)}
			>
				<span class="i-mdi-add text-lg" />
				<span>Create Invoice</span>
			</button>
			<h2 class="text-xl uppercase font-bold">Or</h2>
			<button
				class="flex items-center gap-1 btn btn-success"
				on:click={() => {
					$loadingMessage = 'Importing'
					$loading = true
					importInvoices().finally(() => ($loading = false))
				}}
			>
				<span class="i-mdi-import text-lg" />
				<span>Import Invoices</span>
			</button>
		</div>
	{:else}
		<div class="grid content-start gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
			{#each $userState.filteredInvoices as invoice (invoice.id)}
				<div
					animate:flip={{ duration: 300 }}
					in:fade={{ duration: 150 }}
					out:scale|local
					class="grid"
				>
					<Invoice {...invoice} />
				</div>
			{/each}
		</div>
	{/if}
</div>
