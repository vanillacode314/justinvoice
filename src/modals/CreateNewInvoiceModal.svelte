<script lang="ts">
	import { createInvoice } from '$utils/invoice';

	/// COMPONENTS ///
	import Modal from '$components/base/Modal.svelte';

	/// STATE ///
	import { addressbook, settings, sidebarOpen } from '$stores/app';
	import { createNewInvoiceModal } from '$stores/modals';
	let resetBtn: HTMLInputElement;
	let title: string;
	let senderID: number | '';
	let recipientID: number;
	let form: HTMLFormElement;

	/// METHODS ///
	function onOpen() {
		const inp = form.querySelector('input');
		if (inp) inp.focus();
		senderID = $settings.defaultSender ?? '';
	}

	function resetForm() {
		resetBtn.click();
	}

	function onSubmit() {
		const sender = $addressbook.find((a) => a.id === Number(senderID));
		const recipient = $addressbook.find((a) => a.id === Number(recipientID));
		if (sender && recipient) {
			createInvoice(title, sender, recipient);
		}
		$createNewInvoiceModal = false;
		$sidebarOpen = false;
	}
</script>

<Modal
	id="create-new-invoice-modal"
	bind:open={$createNewInvoiceModal}
	on:close={resetForm}
	on:open={onOpen}
>
	<h3 class="font-bold text-lg">Create New Invoice</h3>
	<form class="flex flex-col" on:submit|preventDefault={onSubmit} bind:this={form}>
		<div class="form-control w-full gap-1">
			<label for="invoice-title" class="label">
				<span class="label-text">Invoice Title</span>
			</label>
			<input
				id="invoice-title"
				type="text"
				name="title"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={title}
			/>
			<label for="invoice-sender" class="label">
				<span class="label-text">Sender's Address</span>
			</label>
			<select
				class="select select-bordered w-full invalid:select-error"
				required
				id="invoice-sender"
				name="sender"
				bind:value={senderID}
			>
				<option value="" selected>Pick an address</option>
				{#each $addressbook as { id, name } (id)}
					<option value={id}>{name}</option>
				{/each}
			</select>
			<label for="invoice-recipient" class="label">
				<span class="label-text">Recipient's Address</span>
			</label>
			<select
				class="select select-bordered w-full invalid:select-error"
				required
				name="recipient"
				id="invoice-recipient"
				bind:value={recipientID}
			>
				<option value="" selected>Pick an address</option>
				{#each $addressbook as { id, name } (id)}
					<option value={id}>{name}</option>
				{/each}
			</select>
		</div>
		<div class="modal-action">
			<label for="create-new-invoice-modal" class="btn btn-ghost">Cancel</label>
			<button class="btn btn-success">Create</button>
		</div>
		<input class="hidden" type="reset" bind:this={resetBtn} />
	</form>
</Modal>
