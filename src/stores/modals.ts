import { writable } from 'svelte/store';

export const createNewInvoiceModal = writable<boolean>(false);
export const addNewAddressModal = writable<boolean>(false);
export const addNewItemModal = writable<boolean>(false);
