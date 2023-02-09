import * as devalue from 'devalue'
import { createZodFetcher } from 'zod-fetch'

export const add = (a: number, b: number) => a + b

export function exportToJsonFile(jsonData: object, name = 'data.json') {
	const dataUri =
		'data:application/json;charset=utf-8,' + encodeURIComponent(devalue.stringify(jsonData))

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
		return { success: true, data: devalue.parse(input) }
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

export function buildFormData(object: Record<string, any>) {
	const formData = new FormData()
	formData.append('value', devalue.stringify(object))
	return formData
}

export function buildQueryString(object: Record<string, any>) {
	const query = new URLSearchParams()
	query.set('value', devalue.stringify(object))
	return query.toString()
}

export function getSelectedFromArray<T>(array: T[], boolean_array: boolean[]): T[] {
	return array.filter((_, index) => boolean_array[index])
}

export function pullKeys<T extends Record<any, any> = any>(
	obj: T,
	keys: (keyof T)[]
): [Pick<T, (typeof keys)[number]>, Omit<T, (typeof keys)[number]>] {
	const result = Object.fromEntries(
		keys.map((key) => [key, obj[key]]).filter(([, value]) => value !== undefined)
	)
	keys.forEach((key) => delete obj[key])
	return [result, obj]
}

export const createFetcher = (
	fetcher: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>
) =>
	createZodFetcher(async (input, init?) => {
		const res = await fetcher(input, init)
		const value = await res.text()
		console.warn(value)
		return devalue.parse(value)
	})

export const genId: (ids: bigint[]) => bigint = (ids = []) => {
	let id = BigInt(Math.floor(Math.random() * Math.pow(10, 16)))
	while (ids.includes(id)) {
		id = BigInt(Math.floor(Math.random() * Math.pow(10, 16)))
	}
	return id
}
