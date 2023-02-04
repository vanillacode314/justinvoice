<script lang="ts">
	import { userState } from '$/stores'
	import type { TInvoice } from '$/types'

	/// STATE ///
	export let id: TInvoice['id']
	export let title: TInvoice['title']
	export let dateOfIssue: TInvoice['dateOfIssue']
	export let senderId: TInvoice['senderId']
	export let recipientId: TInvoice['recipientId']
	export let paid: TInvoice['paid']

	$: recipient = $userState.addressbook.find((address) => address.id == recipientId)
	$: sender = $userState.addressbook.find((address) => address.id == senderId)
	$: dateString = new Date(dateOfIssue).toLocaleDateString()
</script>

<a
	class="card bg-stone-900 shadow overflow-visible cursor-pointer hover:shadow-none p-5 gap-1 transition hover:bg-stone-800"
	href="/app/invoice/{id}"
>
	<h2 class="card-title justify-between items-baseline">
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
