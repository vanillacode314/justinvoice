export function add(acc: number, n: number): number {
	return acc + n;
}

export function exportToJsonFile(jsonData: object, name = 'data.json') {
	const dataStr = JSON.stringify(jsonData);
	const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

	const exportFileDefaultName = name;

	const linkElement = document.createElement('a');
	linkElement.setAttribute('href', dataUri);
	linkElement.setAttribute('download', exportFileDefaultName);
	linkElement.click();
}

export function round(n: number, precision: number): number {
	return Math.round((n + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function getId(length = 16): number {
	const id = Math.floor(Math.random() * Math.pow(10, length)) + 1;
	return id;
}
