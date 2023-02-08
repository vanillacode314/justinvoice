<script lang="ts">
	import Input from '$/components/base/Input.svelte'
	import Select from '$/components/base/Select.svelte'
	import ConfirmModal from '$/modals/ConfirmModal.svelte'
	import { offlineMode, settings, settingsSchema, userState } from '$/stores'
	import { entitySchema, resultSchema } from '$/types'

	const fetcher = createFetcher(fetch)

	const result = settingsSchema.safeParse($settings)
	let formData = result.success ? result.data : settingsSchema.parse({})

	const optionsSchema = entitySchema.transform(({ name, id }) => ({
		label: name,
		value: String(id)
	}))

	function onChange() {
		Object.assign($settings, settingsSchema.parse(formData))
		$settings = $settings
	}

	function clearData() {
		$settings = settingsSchema.parse({})
	}

	onMount(async () => {
		if ($offlineMode) return
		const result = await fetcher(resultSchema(entitySchema.array()), '/api/v1/private/entities')
		if (!result.success) return
		$userState.addressbook = result.data
	})
</script>

<div class="p-5 flex flex-col gap-5">
	<Input
		label="Default Currency"
		id="default-title"
		type="text"
		name="title"
		placeholder="Type here"
		required
		bind:value={formData.defaultCurrency}
		on:input={onChange}
	/>
	<Select
		label="Default Sender"
		options={[
			{
				label: 'Pick a sender',
				value: '',
				disabled: true
			},
			...optionsSchema.array().parse($userState.addressbook)
		]}
		required
		id="invoice-sender"
		name="sender"
		value={formData.defaultSender ? String(formData.defaultSender) : ''}
		on:change={(e) => {
			formData.defaultSender = e.currentTarget.value ? +e.currentTarget.value : null
			onChange()
		}}
	/>
	<ConfirmModal
		title="Delete all data?"
		message="Are you sure you would like to delete all data?"
		icon="i-mdi-warning"
		on:confirm={clearData}
	>
		<button class="btn btn-error">Clear Data</button>
	</ConfirmModal>
</div>
