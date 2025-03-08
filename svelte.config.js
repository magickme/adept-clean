import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true,
			envPrefix: ''
		}),
		alias: {
			'@components': 'src/lib/components',
			'@lib': 'src/lib',
		},
		csrf: {
			checkOrigin: false,
		},
		prerender: {
			handleHttpError: 'warn'
		},
		csp: {
			mode: 'auto'
		},
		version: {
			name: Date.now().toString()
		}
	}
};

export default config;
