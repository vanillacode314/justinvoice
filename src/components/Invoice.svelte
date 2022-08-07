<script lang="ts">
	import { addressbook } from '$stores/app';

	import type { Invoice } from '$utils/invoice';

	/// STATE ///
	export let id: Invoice['id'];
	export let title: Invoice['title'];
	export let date_of_issue: Invoice['date_of_issue'];
	export let senderID: Invoice['senderID'];
	export let recipientID: Invoice['recipientID'];
	export let paid: Invoice['paid'];

	$: recipient = $addressbook.find((address) => address.id == recipientID);
	$: sender = $addressbook.find((address) => address.id == senderID);

	$: dateString = new Date(date_of_issue).toLocaleDateString();
</script>

<a
	class="card max-w-96 bg-base-100 shadow-xl border border-gray-700 overflow-visible cursor-pointer hover:ring p-5 gap-1"
	href="/invoice/{id}"
>
	<h2 class="card-title">
		{title}
		<div class="badge" class:badge-error={!paid} class:badge-success={paid}>
			{paid ? 'Paid' : 'Unpaid'}
		</div>
	</h2>
	<p class="flex gap-1 items-center">
		<span>Date of Issue:</span><span class="font-bold">
			{dateString}
		</span>
	</p>
	<p class="flex gap-1 items-center">
		<span>Sender:</span><span class="font-bold">
			<div class="tooltip tooltip-info" data-tip={sender?.address}>
				{sender?.name}
			</div>
		</span>
	</p>
	<p class="flex gap-1 items-center">
		<span>Recipient:</span><span class="font-bold">
			<div class="tooltip tooltip-info" data-tip={recipient?.address}>
				{recipient?.name}
			</div>
		</span>
	</p>
</a>
