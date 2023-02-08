import type { Readable } from 'svelte/store'

export async function getNextValue<T>(
	store: Readable<T>,
	getKey?: (value: T) => unknown
): Promise<T> {
	return new Promise((resolve) => {
		let firstRun: boolean = true
		let unsubscribe: () => void

		if (getKey) {
			let key = getKey(get(store))
			unsubscribe = store.subscribe((value: T) => {
				if (key === getKey(value)) return
				unsubscribe()
				resolve(value)
			})
			return unsubscribe
		} else {
			unsubscribe = store.subscribe((value: T) => {
				if (firstRun) {
					firstRun = false
					return
				}
				unsubscribe()
				resolve(value)
			})
			return unsubscribe
		}
	})
}
