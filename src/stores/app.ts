import type { Invoice, Item } from '$utils/invoice';
import type { Address } from '$utils/address';
import { writable as localStore } from 'svelte-local-storage-store';
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/env';

function themeStore(): Writable<string> {
	const { set, subscribe, update } = writable<string>('white', () => {
		if (browser) {
			const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
			const eventHandler = () => {
				if (darkMode.matches) {
					set('forest');
					document.documentElement.setAttribute('data-theme', 'forest');
				} else {
					set('light');
					document.documentElement.setAttribute('data-theme', 'light');
				}
			};
			eventHandler();
			darkMode.addEventListener('change', eventHandler);
			return () => {
				darkMode.addEventListener('change', eventHandler);
			};
		}
	});
	return {
		set: (val: string) => {
			set(val);
			document.documentElement.setAttribute('theme', val);
		},
		subscribe,
		update
	};
}

export const theme = themeStore();
export const invoices = localStore<Invoice[]>('invoices', []);
export const addressbook = localStore<Address[]>('addressbook', []);
export const selectedInvoice = writable<Invoice | undefined>(undefined);
export const selectedItem = writable<Item | undefined>(undefined);
export const sidebarOpen = writable<boolean>(false);
