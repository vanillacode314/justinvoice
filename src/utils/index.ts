export const add = (a: number, b: number) => a + b

export function exportToJsonFile(jsonData: object, name = 'data.json') {
	const dataUri =
		'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData))

	const a = document.createElement('a')
	a.setAttribute('href', dataUri)
	a.setAttribute('download', name)
	a.click()
}

export const round = (n: number, precision: number) =>
	Math.round((n + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)

export const getFile = (accept: string = '') =>
	new Promise<string | null>((resolve) => {
		const inp = document.createElement('input')
		inp.type = 'file'
		if (accept) inp.accept = accept

		inp.onchange = () => {
			const file = inp.files?.[0]
			if (!file) {
				resolve(null)
				return
			}

			file.text().then((text) => {
				resolve(text)
			})
		}

		inp.click()
	})

export function safeParseJson<T = any>(
	input: string
): { success: true; data: T } | { success: false; error: unknown } {
	try {
		return { success: true, data: JSON.parse(input) }
	} catch (error) {
		return { success: false, error }
	}
}

export function uniqByKey<T extends Record<string, unknown>>(array: T[], key: keyof T) {
	return array.filter(
		(value1, index) => index === array.findIndex((value2) => value2[key] === value1[key])
	)
}

export function diffByKey<T extends Record<string, unknown>>(
	array1: T[],
	array2: T[],
	key: keyof T
) {
	return array1.filter((value1) => !array2.some((value2) => value2[key] === value1[key]))
}

export function filterInPlace<T>(
	array: T[],
	predicate: (value: T, index: number, array: T[]) => boolean
): void {
	array.splice(0, array.length, ...array.filter(predicate))
}

export function removeInPlace<T>(
	array: T[],
	index: ((value: T, index: number, array: T[]) => boolean) | number
): T {
	if (typeof index !== 'number') {
		index = array.findIndex(index)
	}
	return array.splice(index, 1)[0]
}
export function getFormData(object: Record<string, any>) {
	const formData = new FormData()
	formData.append('value', JSON.stringify(object))
	return formData
}
