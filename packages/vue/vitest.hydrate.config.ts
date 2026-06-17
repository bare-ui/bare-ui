import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Hydration-audit config (`npm run test:hydrate`, phase 2). Runs in jsdom and
// replays each server fixture captured by the SSR phase through a real
// `createSSRApp(...).mount()` hydration, failing on any hydration-mismatch log.
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/test/hydrate.test.ts'],
	},
});
