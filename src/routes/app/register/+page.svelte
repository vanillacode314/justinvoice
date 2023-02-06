<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import { toast } from '$/components/base/Toast.svelte'
	import { userState } from '$/stores'
	import { resultSchema } from '$/types'
	import { goto } from '$app/navigation'

	let processingRegister: boolean = false
	async function onSubmit(e: SubmitEvent) {
		const form = e.currentTarget as HTMLFormElement
		const formData = new FormData(form)

		processingRegister = true
		const res = await fetch('/api/register', {
			method: 'POST',
			redirect: 'manual',
			body: getFormData(Object.fromEntries(formData.entries()))
		}).finally(() => (processingRegister = false))

		const result = resultSchema(z.object({ id: z.number() })).parse(await res.json())
		if (res.ok) {
			await goto('/app')
		} else {
			if (300 <= res.status && res.status < 500) {
				if (result.success) return
				if (result.error.code === 'EMAIL_ALREADY_EXISTS') {
					toast('Email already in use', 'This email is already in use.', { type: 'error' })
				}
			}
		}
	}
</script>

<div class="flex flex-col items-center h-full md:p-10 gap-5">
	<h1 class="uppercase font-black tracking-wide p-10 text-4xl md:text-6xl">JustInvoice</h1>
	<span class="grow" />
	<form
		action="/api/register"
		method="POST"
		on:submit|preventDefault={onSubmit}
		class="md:max-w-xl w-full bg-stone-900 p-5 md:rounded-xl flex flex-col gap-5"
	>
		<h3 class="uppercase font-bold text-lg tracking-wide flex gap-3 items-center">
			<span class="i-material-symbols:account-circle text-4xl" />
			<span> Register </span>
		</h3>
		<Input id="email" name="email" label="Email" type="email" required />
		<Input
			id="password"
			name="password"
			label="Password"
			minlength={8}
			maxlength={64}
			type="password"
			required
		/>
		<div class="flex justify-end gap-5 flex-wrap mt-5">
			<a
				href="/app"
				on:click={() => {
					$userState.offlineMode = true
					$userState = $userState
				}}
				class="btn btn-ghost">Offline Mode</a
			>
			<a href="/app/login" class="btn btn-ghost">Already a User?</a>
			<button type="submit" class="btn btn-primary flex gap-1 items-center">
				{#if processingRegister}
					<div class="animate-spin preserve-3d">
						<span class="i-mdi:dots-circle" />
					</div>
					<span>Registering</span>
				{:else}
					<span class="i-mdi-check text-lg" />
					Register
				{/if}
			</button>
		</div>
	</form>
	<span class="grow hidden md:block" />
</div>
