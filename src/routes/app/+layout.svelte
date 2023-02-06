<script lang="ts">
	import Toast from '$/components/base/Toast.svelte'
	import AlertModal from '$/modals/AlertModal.svelte'
	import { userState } from '$/stores'
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import type { Writable } from 'svelte/store'

	const user = setContext<Writable<number>>('user', writable($page.data.user))
	$: $user = $page.data.user

	let prevOfflineMode: boolean = $userState.offlineMode
	$: if (browser) {
		if (prevOfflineMode !== $userState.offlineMode) {
			prevOfflineMode = $userState.offlineMode
			invalidateAll()
		}
	}
</script>

<slot />
<Toast />
<AlertModal />
