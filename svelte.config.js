import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			$: 'src',
			$components: 'src/components',
			$stores: 'src/stores',
			$utils: 'src/utils',
			$modals: 'src/modals'
		}
	}
}

export default config
