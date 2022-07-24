<script lang="ts" context="module">
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params }) {
		return {
			status: 200,
			props: {
				id: +params.id
			}
		};
	}
</script>

<script lang="ts">
	// @ts-ignore: number-to-words doesn't provide type definitions
	import * as ntw from 'number-to-words';
	import { invoices } from '$stores/app';
	import { GOODS, type Invoice } from '$utils/invoice';
	import { add } from '$utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	/// State
	export let id: Invoice['id'];
	$: invoice = $invoices.find((i) => i.id === id);
	$: issueDate = invoice
		? new Date(invoice.date_of_issue).toLocaleString(undefined, {
				dateStyle: 'full'
		  })
		: undefined;

	onMount(() => {
		const reloaded = window.localStorage.getItem('reloaded');
		if (Number(reloaded)) {
			window.localStorage.setItem('reloaded', '0');
			window.print();
			goto(`/invoice/${id}`);
		} else {
			window.localStorage.setItem('reloaded', '1');
			window.location.reload();
		}
	});
</script>

<svelte:head>
	<title>
		invoice-{id}
	</title>
</svelte:head>
{#if invoice}
	<header>
		<h1>
			{invoice.title}
		</h1>
		<h3>(ID: {invoice.id})</h3>
	</header>
	<main>
		<p>
			<strong>Date of Issue:</strong>
			{issueDate}
		</p>
		<div class="grid">
			<div class="senders-info">
				<span class="label">Sender's Info</span>
				<p>
					<strong>Sender's Name:</strong>
					{invoice.sender.name}
				</p>
				<p>
					<strong>Sender's Address:</strong>
					{invoice.sender.address}
				</p>
			</div>
			<div class="recipients-info">
				<span class="label">Recipient's Info</span>
				<p>
					<strong>Recipient's Name:</strong>
					{invoice.recipient.name}
				</p>
				<p>
					<strong>Recipient's Address:</strong>
					{invoice.recipient.address}
				</p>
			</div>
		</div>
		<table class="log">
			<thead>
				<tr>
					<td id="caption" colspan="7"> Items </td>
				</tr>
				<tr>
					<td> ID / Type</td>
					<td> Title </td>
					<td> Price </td>
					<td> Amount </td>
					<td> Subtotal </td>
				</tr>
			</thead>
			<tbody>
				{#each invoice.items as item (item.id)}
					<tr>
						<td>
							{item.id}
							<br />
							<span style="font-size:x-small; color: gray">
								{item.type === GOODS ? 'Goods' : 'Services'}
							</span>
						</td>
						<td>
							{item.title}
							<br />
							<span style="font-size:x-small; color: gray">
								{item.description}
							</span>
						</td>
						<td> {item.price} {item.currency} </td>
						<td> {item.qty} </td>
						<td> {item.price * item.qty} {item.currency} </td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="bill-in-words">
			Total:
			<em>
				{ntw.toWords(invoice.items.map((item) => item.price * item.qty).reduce(add, 0))}
				<strong>{invoice.items[0].currency}</strong>
			</em>
		</div>
	</main>
{:else}
	<main>
		<h1>Invoice with id {id} not found</h1>
	</main>
{/if}

<style lang="postcss">
	p {
		margin: 0;
	}
	header {
		margin-bottom: 1rem;
		h3 {
			font-weight: normal;
			padding: 0;
			margin: 0;
		}
		h1 {
			padding: 0;
			margin: 1rem 0;
			text-decoration: underline;
			font-size: xx-large;
			font-weight: bold;
		}
	}

	.bill-in-words {
		border: 1px solid black;
		margin-block: 1rem;
		padding: 1rem;
		box-sizing: border-box;
		font-size: x-large;
		text-transform: lowercase;
		strong {
			text-transform: uppercase;
		}
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.senders-info,
	.recipients-info {
		position: relative;
		.label {
			padding: 0;
			position: absolute;
			top: -0.5rem;
			background-color: white;
			font-size: smaller;
		}
		border: 1px solid black;
		padding: 1rem;
		margin-block: 1rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		td {
			border: 1px solid black;
			padding: 0.3rem 0.5rem;
			margin: 0;
		}
		thead {
			#caption {
				font-size: x-large;
				text-align: center;
				font-weight: bold;
			}
			background-color: #aaa;
			color: #111;
		}
	}
</style>
