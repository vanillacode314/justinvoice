<script lang="ts">
	import Invoice from '$/components/Invoice.svelte'
	import { createNewInvoiceModalOpen } from '$/modals/auto-import/CreateNewInvoiceModal.svelte'
	import { prompt } from '$/modals/auto-import/PromptModal.svelte'
	import { appState, userState } from '$/stores'
	import type { TInvoice } from '$/types'

	let invoices: TInvoice[]

	$: {
		;({ invoices } = $userState)
	}

	onMount(() => {
		$appState.actions = [
			{
				icon: 'i-mdi-import',
				label: 'Import Invoice(s)',
				action: importInvoices
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
					exportAll(name)
				}
			},
			{
				icon: 'i-mdi-add',
				label: 'Add',
				color: 'btn-primary',
				action: () => ($createNewInvoiceModalOpen = true)
			}
		]
	})
	onDestroy(() => {
		$appState.actions = []
	})
</script>

<div class="p-5">
	{#if invoices.length > 0}
		<div class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
			{#each invoices as invoice (invoice.id)}
				<Invoice {...invoice} />
			{/each}
		</div>
	{:else}
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
			<button class="flex items-center gap-1 btn btn-success" on:click={importInvoices}>
				<span class="i-mdi-import text-lg" />
				<span>Import Invoices</span>
			</button>
		</div>
	{/if}
</div>
