<script lang="ts">
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import { createNewInvoiceModalOpen } from '$/modals/auto-import/CreateNewInvoiceModal.svelte'
	import { prompt } from '$/modals/auto-import/PromptModal.svelte'
	import { appState, type TAction } from '$/stores'
	import { page } from '$app/stores'
	import Fab from './Fab.svelte'

	interface ILink {
		href: string
		title: string
		icon: any
		actions?: Button[]
	}

	interface Button {
		clickHandler: (e: MouseEvent) => any
		title: string
		icon: any
	}

	/// STATE ///
	const links: ILink[] = [
		{
			href: '/app',
			title: 'Invoices',
			icon: 'i-mdi-document',
			actions: [
				{
					clickHandler: () => ($createNewInvoiceModalOpen = true),
					title: 'Create New Invoice',
					icon: 'i-mdi-add'
				},
				{
					clickHandler: async () => {
						const name = await prompt({
							icon: 'i-mdi-export',
							title: 'Export Invoices',
							message: 'Enter filename (timestamp will be auto appended to the name):',
							initialValue: `justinvoices`
						})
						if (!name) return
						exportAll(name)
					},
					title: 'Export All Invoices',
					icon: 'i-mdi-export'
				},
				{
					clickHandler: importInvoices,
					title: 'Import Invoice(s)',
					icon: 'i-mdi-import'
				}
			]
		},
		{
			href: '/app/addressbook',
			title: 'Address Book',
			icon: 'i-mdi-user',
			actions: [
				{
					clickHandler: () => ($addNewAddressModalOpen = true),
					title: 'Add New Address',
					icon: 'i-mdi-add'
				}
			]
		},
		{
			href: '/app/settings',
			title: 'Settings',
			icon: 'i-mdi-cog'
		}
	]

	$: actions = $appState.actions.filter((item) => item !== 'spacer' && !item.noFab) as TAction[]
</script>

<div class="drawer drawer-mobile">
	<input
		id="my-drawer-3"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={$appState.drawerVisible}
	/>
	<div class="drawer-content flex flex-col" id="scroller">
		<!-- Toolbar -->
		<div class="p-5 hidden lg:flex justify-end gap-5">
			{#each $appState.actions as item, index (item === 'spacer' ? `spacer-${index}` : item.label)}
				{#if item !== 'spacer'}
					{@const { icon, action, label, color } = item}
					<button
						in:scale={{ duration: 150 }}
						class="btn btn-sm flex gap-1 {color} items-center"
						on:click={action}
					>
						<span class="{icon} text-lg" />
						<span>{label}</span>
					</button>
				{:else}
					<span class="grow" />
				{/if}
			{/each}
		</div>
		<!-- Fab -->
		{#if actions.length > 0}
			<Fab {actions} />
		{/if}
		<!-- Navbar -->
		<div class="w-full navbar lg:hidden sticky top-0 z-30 bg-base-300 gap-3">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-ghost">
					<span class="i-mdi-menu text-2xl" />
				</label>
			</div>
			<a href="/app" class="uppercase font-black tracking-wide">JustInvoice</a>
		</div>
		<!-- Main -->
		<div class="shrink-0">
			<slot />
		</div>
	</div>
	<!-- Sidebar -->
	<div class="drawer-side grid-rows-[1fr,auto]">
		<label for="my-drawer-3" class="drawer-overlay backdrop-blur-sm" />
		<ul class="menu lg:menu-compact p-4 overflow-y-auto w-80 bg-base-200 gap-3 shadow">
			<!-- Sidebar content here -->
			<h2 class="py-5 text-2xl uppercase font-black tracking-wide text-center">JustInvoice</h2>
			<!-- <div class="divider" /> -->
			{#each links as { href, title, icon, actions } (href)}
				{@const active = $page.url.pathname === href}
				<li>
					<a
						class:active
						{href}
						class="flex items-center gap-3"
						on:click={() => {
							if (active) return
							$appState.drawerVisible = false
						}}
						><span class="text-lg {icon}" />
						<span class="text-xs tracking-wide uppercase font-bold">
							{title}
						</span>
					</a>
				</li>
				<!-- Actions -->
				{#each active && actions ? actions : [] as { title, icon, clickHandler }}
					<li>
						<button on:click={clickHandler} class="flex items-center gap-3"
							>&nbsp;&nbsp;&nbsp;<span class="text-lg {icon}" />
							<span class="text-xs tracking-wide uppercase font-bold">
								{title}
							</span>
						</button>
					</li>
				{/each}
			{/each}
			<span class="grow" />
			<div class="text-center px-5 underline hover:text-primary transition-colors">
				<a href="https://raqueebuddinaziz.com">Made By Raqueebuddin Aziz</a>
			</div>
			<div class="text-center px-5">
				Current Version: {__version__}
			</div>
		</ul>
	</div>
</div>
