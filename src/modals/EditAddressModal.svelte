<script lang="ts">
	/// COMPONENTS ///
	import Modal from '$components/base/Modal.svelte';

	/// STATE ///
	import { addressbook, selectedAddress, sidebarOpen } from '$stores/app';
	import { editAddressModal } from '$stores/modals';
	let form: HTMLFormElement;
	let name: string;
	let address: string;

	/// METHODS ///
	function onOpen() {
		if ($selectedAddress) {
			({ name, address } = $selectedAddress);
		}
		const inp = form.querySelector('input');
		if (inp) inp.focus();
	}

	function onSubmit() {
		if ($selectedAddress) {
			$selectedAddress = Object.assign($selectedAddress, { name, address });
			$addressbook = $addressbook;
		}
		$editAddressModal = false;
		$sidebarOpen = false;
	}
</script>

<Modal id="edit-address-modal" bind:open={$editAddressModal} on:open={onOpen}>
	<h3 class="font-bold text-lg">Edit Address</h3>
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
			<label for="edit-address-modal" class="btn btn-ghost">Cancel</label>
			<button class="btn btn-success">Save</button>
		</div>
	</form>
</Modal>
