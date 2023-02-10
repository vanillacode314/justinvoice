/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: bigint | null
		offlineMode: boolean
		expired: boolean
	}
	interface PageData extends TResult<{ invoices: TInvoice[]; addressbook: TEntity[] }> {
		user: bigint | null
		expired: boolean
	}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

declare const __version__: string
