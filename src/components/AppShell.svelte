<script lang="ts">
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import { createNewInvoiceModalOpen } from '$/modals/auto-import/CreateNewInvoiceModal.svelte'
	import { appState } from '$/stores'
	import { page } from '$app/stores'

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
			title: 'Invoice',
			icon: 'i-mdi-document',
			actions: [
				{
					clickHandler: () => ($createNewInvoiceModalOpen = true),
					title: 'Create New Invoice',
					icon: 'i-mdi-add'
				},
				{
					clickHandler: exportAll,
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
</script>

<div class="drawer drawer-mobile">
	<input
		id="my-drawer-3"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={$appState.drawerVisible}
	/>
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar lg:hidden">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-ghost">
					<span class="i-mdi-menu text-xl" />
				</label>
			</div>
			<div class="flex-1 px-2 mx-2">JustInvoice</div>
		</div>
		<!-- Main -->
		<slot />
	</div>
	<!-- Sidebar -->
	<div class="drawer-side border-r border-gray-700 grid-rows-[1fr,auto]">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="menu lg:menu-compact p-4 overflow-y-auto w-80 bg-base-100 gap-3">
			<!-- Sidebar content here -->
			<h2 class="pt-5 text-2xl font-bold text-center">JustInvoice</h2>
			<div class="divider" />
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
			<div class="text-center px-5 underline hover:text-primary">
				<a href="https://raqueebuddinaziz.com">Made By Raqueebuddin Aziz</a>
			</div>
			<div class="text-center px-5">
				Current Version: {__version__}
			</div>
		</ul>
	</div>
</div>
