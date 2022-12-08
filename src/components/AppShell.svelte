<script lang="ts">
	/// ICONS ///
	import IconMenu from '~icons/mdi/menu';
	import IconDocument from '~icons/mdi/document';
	import IconUser from '~icons/mdi/user';
	import IconAdd from '~icons/mdi/add';
	import IconExport from '~icons/mdi/export';
	import IconImport from '~icons/mdi/import';
	import IconCog from '~icons/mdi/cog';

	interface Link {
		href: string;
		title: string;
		icon: any;
		actions?: Button[];
	}

	type ClickHandler = (e: MouseEvent) => any;
	interface Button {
		clickHandler: ClickHandler;
		title: string;
		icon: any;
	}

	/// STATE ///
	let filesInput: HTMLInputElement;
	import { page } from '$app/stores';
	import { addNewAddressModal, createNewInvoiceModal } from '$stores/modals';
	import { addressbook, invoices, sidebarOpen } from '$stores/app';
	import { exportToJsonFile, getId } from '$utils';
	import type { Invoice } from '$utils/invoice';
	import type { Address } from '$utils/address';
	const links: Link[] = [
		{
			href: '/',
			title: 'Invoice',
			icon: IconDocument,
			actions: [
				{
					clickHandler: () => ($createNewInvoiceModal = true),
					title: 'Create New Invoice',
					icon: IconAdd
				},
				{
					clickHandler: exportAll,
					title: 'Export All Invoices',
					icon: IconExport
				},
				{
					clickHandler: importInvoices,
					title: 'Import Invoice(s)',
					icon: IconImport
				}
			]
		},
		{
			href: '/addressbook',
			title: 'Address Book',
			icon: IconUser,
			actions: [
				{
					clickHandler: () => ($addNewAddressModal = true),
					title: 'Add New Address',
					icon: IconAdd
				}
			]
		},
		{
			href: '/settings',
			title: 'Settings',
			icon: IconCog
		}
	];

	/// METHODS ///
	function exportAll() {
		const dateString = new Date().toLocaleString(undefined, {
			dateStyle: 'short',
			timeStyle: 'short',
			hour12: false
		});
		exportToJsonFile(
			{ invoices: $invoices, addressbook: $addressbook },
			`justinvoices-${dateString}.json`
		);
	}

	function importInvoices() {
		filesInput.click();
	}

	async function handleFiles(e: Event) {
		const inp = e.target as HTMLInputElement;
		if (inp.files) {
			const file = inp.files[0];
			const content = await file.text();
			let { invoices: _invoices, addressbook: _addressbook } = JSON.parse(content) as {
				invoices: Invoice | Invoice[];
				addressbook: Address[];
			};
			if (!Array.isArray(_invoices)) {
				_invoices = [_invoices];
			}
			$addressbook = _addressbook
			for (const invoice of _invoices) {
				if ($invoices.find((i) => i.id === invoice.id)) {
					invoice.id = getId();
				}
			}
			$invoices = [...$invoices, ..._invoices];
		}
	}
</script>

<div class="drawer drawer-mobile">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:checked={$sidebarOpen} />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-300 lg:hidden">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-ghost">
					<IconMenu />
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
				<li>
					<a class:active={$page.url.pathname === href} {href}
						><svelte:component this={icon} /> {title}</a
					>
				</li>
				{#if $page.url.pathname === href}
					{#if actions}
						{#each actions as { title, icon, clickHandler }}
							<li>
								<button on:click={clickHandler}
									>&nbsp;<svelte:component this={icon} /> {title}</button
								>
							</li>
						{/each}
					{/if}
				{/if}
			{/each}
			<div class="mt-auto text-center p-5 underline hover:text-primary">
				<a href="https://raqueebuddinaziz.com">Made By Raqueebuddin Aziz</a>
			</div>
		</ul>
	</div>
</div>
<input
	type="file"
	class="hidden"
	bind:this={filesInput}
	on:change={handleFiles}
	accept=".json,application/json"
/>
