export function fadeIn(node: HTMLElement) {
	const keyframes: Keyframe[] = [
		{
			transform: 'scale(90%)',
			opacity: 0
		},
		{
			transform: 'scale(100%)',
			opacity: 1
		}
	]

	const options: KeyframeAnimationOptions = {
		duration: 150,
		fill: 'forwards',
		easing: 'ease-out'
	}

	node.animate(keyframes, options)
}
