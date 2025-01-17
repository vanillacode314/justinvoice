<script context="module" lang="ts">
	import { nanoid } from "nanoid"

	type MessageType = 'info' | 'warning' | 'error' | 'success'
	interface Message {
		id: string
		title: string
		content: string
		type: MessageType
	}
	const messages = writable<Message[]>([])

	interface Opts {
		type: MessageType
		duration: number
	}

	export function toast(
		title: string,
		content: string,
		{ type = 'info', duration = 3000 }: Partial<Opts> = {}
	): Message {
		const message = {
			id: nanoid(),
			title,
			content,
			type
		}

		messages.update(($messages) => {
			$messages.push(message)
			return $messages
		})

		setTimeout(() => {
			messages.update(($messages) => {
				removeInPlace($messages, (m) => m.id === message.id)
				return $messages
			})
		}, duration)

		return message
	}

	const iconMap = {
		info: 'i-mdi-information',
		warning: 'i-material-symbols-warning',
		error: 'i-mdi-close-circle',
		success: 'i-material-symbols-check-circle'
	} satisfies Record<MessageType, string>
</script>

<script lang="ts">
	let innerWidth: number
</script>

<svelte:window bind:innerWidth />
<div
	class="toast min-w-full"
	class:toast-top={innerWidth < 768}
	class:toast-center={innerWidth < 768}
>
	{#each $messages as { id, title, content, type } (id)}
		<div
			class="alert items-start"
			class:alert-info={type === 'info'}
			class:alert-warning={type === 'warning'}
			class:alert-error={type === 'error'}
			class:alert-success={type === 'success'}
			transition:scale={{ duration: 200 }}
			animate:flip
		>
			<div class="flex gap-3">
				<span class="shrink-0 {iconMap[type]} text-3xl" />
				<div class="flex flex-col gap-1 items-start">
					<span class="uppercase font-bold tracking-wider text-xs">{title}</span>
					<span class="text-sm">{content}</span>
				</div>
			</div>
		</div>
	{/each}
</div>
