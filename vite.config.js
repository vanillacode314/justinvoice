import { sveltekit } from '@sveltejs/kit/vite'
import { extractorSvelte, presetIcons, presetWebFonts } from 'unocss'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import pkgJson from './package.json'

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		__version__: JSON.stringify(pkgJson.version)
	},
	build: {
		sourcemap: true
	},
	plugins: [
		AutoImport({
			imports: [
				'svelte',
				'svelte/store',
				'svelte/easing',
				'svelte/motion',
				'svelte/animate',
				'svelte/transition',
				{
					zod: ['z'],
					'svelte-local-storage-store': ['persisted'],
					clsx: ['clsx']
				}
			],
			dirs: ['./src/lib/', './src/utils/'],
			dts: 'src/auto-imports.d.ts'
		}),
		Unocss({
			extractors: [extractorSvelte],
			presets: [
				presetWebFonts({
					extendTheme: true,
					fonts: {
						sans: 'Inter:400,500,600,700,800,900'
					}
				}),
				presetIcons({
					extraProperties: {
						color: 'auto',
						display: 'inline-block',
						'vertical-align': 'middle'
					}
				})
			]
		}),
		sveltekit()
	]
}

export default config
