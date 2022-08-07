<script lang="ts">
	import { addressbook, selectedAddress } from '$stores/app';

	import { editAddressModal } from '$stores/modals';

	import { removeAddress, type Address } from '$utils/address';

	/// STATE ///
	export let id: Address['id'];
	export let name: Address['name'];
	export let address: Address['address'];

	function onEdit() {
		$selectedAddress = $addressbook.find((address) => address.id === id);
		$editAddressModal = true;
	}
</script>

<div class="card max-w-96 bg-base-100 shadow-xl border border-gray-700">
	<div class="card-body">
		<h2 class="card-title">{name}</h2>
		<p>{address}</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary btn-sm" on:click={onEdit}>Edit</button>
			<button
				class="btn btn-ghost btn-sm"
				on:click={() => {
					removeAddress(id);
				}}>Remove</button
			>
		</div>
	</div>
</div>
