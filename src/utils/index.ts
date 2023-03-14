import { fetchSchema, resultSchema } from '$/types'
import * as devalue from 'devalue'
import type z from 'zod'
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

export function diffByKey<T extends Record<string, unknown>, K extends keyof T>(
	array1: T[],
	array2: Pick<T, K>[],
	key: K
): T[] {
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
) => {
	const fetchWithZod = createZodFetcher(async (input: URL | RequestInfo, init?: RequestInit) => {
		const res = await fetcher(input, init)
		const value = await res.text()
		const result = devalue.parse(value) as TResult<any>
		return { ...result, statusCode: res.status }
	})
	return async <TSchema extends z.ZodTypeAny>(
		schema: TSchema,
		input: URL | RequestInfo,
		init?: RequestInit
	) => fetchWithZod(fetchSchema(schema), input, init)
}

export const genId: (ids?: bigint[]) => bigint = (ids = []) => {
	let id = BigInt(Math.floor(Math.random() * Math.pow(10, 16)))
	while (ids.includes(id)) {
		id = BigInt(Math.floor(Math.random() * Math.pow(10, 16)))
	}
	return id
}

export function isEqual(a: any, b: any): boolean {
	if (a === b) return true
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
	if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return a === b
	if (Array.isArray(a) !== Array.isArray(b)) return false

	let keys = Object.keys(a)
	if (keys.length !== Object.keys(b).length) return false

	return keys.every((k) => isEqual(a[k], b[k]))
}
