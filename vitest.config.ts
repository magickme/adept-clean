import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    deps: {
      inline: ['@testing-library/svelte']
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    }
  },
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib')
    },
    conditions: ['browser', 'development']
  },
  server: {
    deps: {
      inline: ['@testing-library/svelte']
    }
  }
}); 