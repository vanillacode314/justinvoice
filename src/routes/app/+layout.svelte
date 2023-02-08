<script lang="ts">
	import Toast from '$/components/base/Toast.svelte'
	import AlertModal from '$/modals/AlertModal.svelte'
	import { page } from '$app/stores'
	import type { Writable } from 'svelte/store'

	const user = setContext<Writable<number>>('user', writable($page.data.user))
	$: $user = $page.data.user
</script>

<slot />
<Toast />
<AlertModal />
