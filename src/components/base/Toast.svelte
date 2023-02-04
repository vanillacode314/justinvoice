<script context="module" lang="ts">
	type MessageType = 'info' | 'warning' | 'error' | 'success'
	interface Message {
		id: string
		title: string
		content: string
		type: MessageType
	}
	const messages = writable<Message[]>([])

	interface Opts {
		duration: number
	}

	export function toast(
		title: string,
		content: string,
		type: MessageType = 'info',
		{ duration = 3000 }: Partial<Opts> = {}
	): Message {
		const message = {
			id: crypto.randomUUID(),
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

<div class="toast">
	{#each $messages as { id, title, content, type } (id)}
		<div
			class="alert"
			class:alert-info={type === 'info'}
			class:alert-warning={type === 'warning'}
			class:alert-error={type === 'error'}
			class:alert-success={type === 'success'}
			transition:scale={{ duration: 200 }}
			animate:flip
		>
			<div class="flex gap-3">
				<span class="{iconMap[type]} text-3xl" />
				<div class="flex flex-col gap-1 items-start">
					<span class="uppercase font-bold tracking-wider text-xs">{title}</span>
					<span class="text-sm">{content}</span>
				</div>
			</div>
		</div>
	{/each}
</div>
