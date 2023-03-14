const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			}
		}
	},

	daisyui: {
		logs: false
	},
	plugins: [require('daisyui')]
}

module.exports = config
