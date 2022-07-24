<script lang="ts">
	import { removeAddress, type Address } from '$utils/address';

	/// STATE ///
	export let id: Address['id'];
	export let name: Address['name'];
	export let address: Address['address'];
</script>

<div class="card max-w-96 bg-base-100 shadow-xl border border-gray-700">
	<div class="card-body">
		<h2 class="card-title">{name}</h2>
		<p>{address}</p>
		<div class="card-actions justify-end">
			<button
				class="btn btn-error"
				on:click={() => {
					removeAddress(id);
				}}>Remove</button
			>
		</div>
	</div>
</div>
