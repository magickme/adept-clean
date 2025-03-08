import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import viteCompression from 'vite-plugin-compression';
import lightningcss from 'vite-plugin-lightningcss';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		lightningcss({
			minify: true,
			browserslist: '>= 0.25%'
		}),
		viteCompression({
			algorithm: 'brotliCompress',
			threshold: 512,
			priority: 2,
		}),
		viteCompression({
			algorithm: 'gzip',
				threshold: 512,
				priority: 3,
		})
	],
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
				passes: 2,
				unsafe: true
			},
			mangle: true,
			format: {
				comments: false
			}
		},
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith('.css')) {
						return '_app/immutable/assets/[name].[hash][extname]';
					}
					return '_app/immutable/assets/[name].[hash][extname]';
				},
				chunkFileNames: '_app/immutable/chunks/[name].[hash].js',
				entryFileNames: '_app/immutable/entry/[name].[hash].js',
				manualChunks(id) {
					if (id.includes('node_modules/plyr')) {
						return 'vendor-plyr';
					}
					if (id.includes('node_modules/dompurify')) {
						return 'vendor-dompurify';
					}
					if (id.includes('node_modules/@tailwindcss')) {
						return 'vendor-tailwind';
					}
					if (id.includes('node_modules')) {
						return 'vendor';
					}
					if (id.includes('routes')) {
						return 'routes';
					}
					if (id.includes('components')) {
						return 'components';
					}
				}
			},
			treeshake: {
				moduleSideEffects: true,
				propertyReadSideEffects: false,
				tryCatchDeoptimization: false
			}
		},
		target: 'esnext',
		cssMinify: true,
		sourcemap: false
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	}
}));
