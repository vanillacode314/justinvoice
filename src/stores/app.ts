import type { Invoice, Item } from '$utils/invoice';
import type { Address } from '$utils/address';
import { writable as localStorageStore } from 'svelte-local-storage-store';
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

const DARK_THEME = 'forest';
const LIGHT_THEME = DARK_THEME;

function themeStore(): Writable<string> {
	const { set, subscribe, update } = writable<string>('white', () => {
		if (browser) {
			const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
			const eventHandler = () => {
				if (darkMode.matches) {
					set('forest');
					document.documentElement.setAttribute('data-theme', DARK_THEME);
				} else {
					set('light');
					document.documentElement.setAttribute('data-theme', LIGHT_THEME);
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

interface Settings {
	defaultSender: Address['id'] | null;
}

export const settings = localStorageStore<Settings>('settings', {
	defaultSender: null
});
export const theme = themeStore();
export const invoices = localStorageStore<Invoice[]>('invoices', []);
export const addressbook = localStorageStore<Address[]>('addressbook', []);
export const selectedInvoice = writable<Invoice | undefined>(undefined);
export const selectedItem = writable<Item | undefined>(undefined);
export const selectedAddress = writable<Address | undefined>(undefined);
export const sidebarOpen = writable<boolean>(false);
