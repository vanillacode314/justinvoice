import { throttle } from 'lodash-es'

type Pos = { x: number; y: number }

export interface Options {
	callback?: () => any
	duration?: () => number
	moveCancelThreshold?: number
	condition?: () => boolean
}

function distance(pos1: Pos, pos2: Pos): number {
	return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
}

function findTouch(touchList: TouchList, id: number): Touch | undefined {
	return [...touchList].find((touch) => touch.identifier === id)
}

export const longpress = (
	node: HTMLElement,
	{
		condition = () => true,
		callback = () => {},
		duration = () => 1000,
		moveCancelThreshold = 50
	}: Options = {}
) => {
	let timer: ReturnType<typeof setTimeout>
	let startPos: Pos = { x: -1, y: -1 }
	let touchId: number = -1

	const onTouchStart = (e: TouchEvent) => {
		if (!condition()) return
		if (touchId > -1) return
		const touch = e.changedTouches[0]
		touchId = touch.identifier
		startPos = { x: touch.screenX, y: touch.screenY }
		timer = setTimeout(() => callback(), duration())
	}

	const onMouseDown = (e: MouseEvent) => {
		if (!condition()) return
		const el = e.currentTarget as HTMLElement
		el.classList.add('__longpress__')
		timer = setTimeout(() => callback(), duration())
	}

	const onMouseUp = (e: MouseEvent) => {
		const el = e.currentTarget as HTMLElement
		setTimeout(() => el.classList.remove('__longpress__'), 500)
		clearTimeout(timer)
	}

	const onTouchMove = throttle((e: TouchEvent) => {
		if (touchId < 0) return
		const touch = findTouch(e.changedTouches, touchId)
		if (!touch) return
		if (distance(startPos, { x: touch.screenX, y: touch.screenY }) < moveCancelThreshold) return

		clearTimeout(timer)
	}, duration() / 4)

	const onTouchEnd = () => {
		touchId = -1
		clearTimeout(timer)
	}

	const onContextMenu = (e: Event) => {
		touchId > -1 && e.preventDefault()
	}

	node.addEventListener('contextmenu', onContextMenu)
	node.addEventListener('touchstart', onTouchStart, { passive: true })
	node.addEventListener('touchmove', onTouchMove, { passive: true })
	node.addEventListener('touchend', onTouchEnd, { passive: true })
	node.addEventListener('touchcancel', onTouchEnd, { passive: true })
	node.addEventListener('mousedown', onMouseDown, { capture: true })
	node.addEventListener('mouseout', onMouseUp)
	node.addEventListener('mouseup', onMouseUp)

	return () => {
		node.removeEventListener('contextmenu', onContextMenu)
		node.removeEventListener('touchstart', onTouchStart)
		node.removeEventListener('touchmove', onTouchMove)
		node.removeEventListener('touchend', onTouchEnd)
		node.removeEventListener('touchcancel', onTouchEnd)
		node.removeEventListener('mousedown', onMouseDown)
		node.removeEventListener('mouseout', onMouseUp)
		node.removeEventListener('mouseup', onMouseUp)
	}
}
