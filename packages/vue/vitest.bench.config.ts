import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Standalone config for the render benchmark suite (`npm run bench`). Kept
// separate from vitest.config.ts so the benchmark dependencies (Radix Vue,
// Headless UI) and the jsdom mount harness never load during unit/a11y test
// runs. Vue's @vue/server-renderer works against the same vite-plugin-vue
// build as the client — no separate SSR transform config is needed.
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./bench/setup.ts'],
		include: ['bench/**/*.bench.ts'],
		benchmark: {
			include: ['bench/**/*.bench.ts'],
		},
	},
});
