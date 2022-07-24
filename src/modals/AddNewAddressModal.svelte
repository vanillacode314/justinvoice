<script lang="ts">
	/// COMPONENTS ///
	import Modal from '$components/base/Modal.svelte';

	/// STATE ///
	import { sidebarOpen } from '$stores/app';
	import { addNewAddressModal } from '$stores/modals';
	import { addAddress } from '$utils/address';
	let resetBtn: HTMLInputElement;
	let form: HTMLFormElement;
	let name: string;
	let address: string;

	/// METHODS ///
	function focusForm() {
		const inp = form.querySelector('input');
		if (inp) inp.focus();
	}

	function resetForm() {
		resetBtn.click();
	}

	function onSubmit() {
		addAddress(name, address);
		$addNewAddressModal = false;
		$sidebarOpen = false;
	}
</script>

<Modal
	id="add-new-address-modal"
	bind:open={$addNewAddressModal}
	on:close={resetForm}
	on:open={focusForm}
>
	<h3 class="font-bold text-lg">Add New Address</h3>
	<form class="flex flex-col" on:submit|preventDefault={onSubmit} bind:this={form}>
		<div class="form-control w-full gap-1">
			<label for="addressbook-name" class="label">
				<span class="label-text">Name</span>
			</label>
			<input
				id="addressbook-name"
				type="text"
				name="name"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={name}
			/>
			<label for="addressbook-address" class="label">
				<span class="label-text">Address</span>
			</label>
			<input
				id="addressbook-address"
				name="address"
				type="text"
				placeholder="Type here"
				class="input input-bordered w-full invalid:input-error"
				required
				bind:value={address}
			/>
		</div>
		<div class="modal-action">
			<label for="add-new-address-modal" class="btn btn-ghost">Cancel</label>
			<button class="btn btn-success">Create</button>
		</div>
		<input class="hidden" type="reset" bind:this={resetBtn} />
	</form>
</Modal>
