<script lang="ts">
	import { addNewAddressModalOpen } from '$/modals/auto-import/AddNewAddressModal.svelte'
	import { createNewInvoiceModalOpen } from '$/modals/auto-import/CreateNewInvoiceModal.svelte'
	import { prompt } from '$/modals/auto-import/PromptModal.svelte'
	import { appState, loadingMessage, offlineMode, type TAction } from '$/stores'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { Writable } from 'svelte/store'
	import Fab from './Fab.svelte'

	const user = getContext<Writable<number>>('user')
	const loading = getContext<Writable<boolean>>('loading')

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
			icon: 'i-mdi-document'
			/* actions: [ */
			/* 	{ */
			/* 		clickHandler: () => ($createNewInvoiceModalOpen = true), */
			/* 		title: 'Create New Invoice', */
			/* 		icon: 'i-mdi-add' */
			/* 	}, */
			/* 	{ */
			/* 		clickHandler: async () => { */
			/* 			const name = await prompt({ */
			/* 				icon: 'i-mdi-export', */
			/* 				title: 'Export Invoices', */
			/* 				message: 'Enter filename (timestamp will be auto appended to the name):', */
			/* 				initialValue: `justinvoices` */
			/* 			}) */
			/* 			if (!name) return */
			/* 			$loadingMessage = 'Exporting' */
			/* 			$loading = true */
			/* 			await exportAll(name).finally(() => ($loading = false)) */
			/* 		}, */
			/* 		title: 'Export All Invoices', */
			/* 		icon: 'i-mdi-export' */
			/* 	}, */
			/* 	{ */
			/* 		clickHandler: () => { */
			/* 			$loadingMessage = 'Importing' */
			/* 			$loading = true */
			/* 			importInvoices().finally(() => ($loading = false)) */
			/* 		}, */
			/* 		title: 'Import Invoice(s)', */
			/* 		icon: 'i-mdi-import' */
			/* 	} */
			/* ] */
		},
		{
			href: '/app/addressbook',
			title: 'Address Book',
			icon: 'i-mdi-user'
			/* actions: [ */
			/* 	{ */
			/* 		clickHandler: () => ($addNewAddressModalOpen = true), */
			/* 		title: 'Add New Address', */
			/* 		icon: 'i-mdi-add' */
			/* 	} */
			/* ] */
		},
		{
			href: '/app/settings',
			title: 'Settings',
			icon: 'i-mdi-cog'
		}
	]

	$: actions = $appState.actions.filter(
		(action) => action === 'spacer' || action.mode === $appState.mode
	)
	$: fabActions = $appState.actions.filter(
		(action) => action !== 'spacer' && action.mode === $appState.mode && !action.noFab
	) as TAction[]

	let processingLogout: boolean = false
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
		<div class="pt-5 px-5 hidden lg:flex justify-end gap-5">
			{#each actions as item, index (item === 'spacer' ? `spacer-${index}` : item.id)}
				{#if item !== 'spacer'}
					{@const { icon, action, label, color } = item}
					<button
						in:scale={{ duration: 150 }}
						class="btn btn-sm flex gap-1 {color()} items-center"
						on:click={action}
					>
						<span class="{icon} text-lg" />
						<span>{label()}</span>
					</button>
				{:else}
					<span class="grow" />
				{/if}
			{/each}
		</div>
		<!-- Fab -->
		{#if fabActions.length > 0}
			<Fab actions={fabActions} />
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
		<div class="shrink-0 grow">
			<slot />
		</div>
	</div>
	<!-- Sidebar -->
	<div class="drawer-side grid-rows-[1fr,auto]">
		<label for="my-drawer-3" class="drawer-overlay backdrop-blur-sm" />
		<ul class="menu lg:menu-compact p-4 overflow-y-auto w-80 bg-base-200 gap-3 shadow">
			<!-- Sidebar content here -->
			<div class="py-5 flex flex-col gap-5">
				<h2 class="text-2xl uppercase font-black tracking-wide text-center">JustInvoice</h2>
				<label
					class="uppercase font-semibold text-gray-400 tracking-wider text-xs cursor-pointer items-center flex gap-5 justify-center"
				>
					<span>Offline</span>
					<input
						type="checkbox"
						class="toggle"
						checked={!$offlineMode}
						on:change={(e) => {
							$offlineMode = !e.currentTarget.checked
						}}
					/>
					<span>Online</span>
				</label>
			</div>
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
			{#if $user}
				<form
					on:submit|preventDefault={async () => {
						processingLogout = true
						await fetch('/api/v1/logout').finally(() => (processingLogout = false))
						await goto('/app/login')
					}}
					action="/api/v1/logout"
					class="contents"
				>
					<button class="btn btn-outline text-gray-50 flex items-center gap-3">
						{#if processingLogout}
							<div class="animate-spin preserve-3d">
								<span class="i-mdi:dots-circle" />
							</div>
							<span>Logging out</span>
						{:else}
							<span class="i-mdi:logout" />
							<span>Logout</span>
						{/if}
					</button>
				</form>
			{/if}
			<div class="text-center px-5 underline hover:text-primary transition-colors">
				<a target="_blank" rel="noreferrer" href="https://raqueebuddinaziz.com"
					>Made By Raqueebuddin Aziz</a
				>
			</div>
			<div class="text-center px-5">
				Current Version: {__version__}
			</div>
		</ul>
	</div>
</div>
