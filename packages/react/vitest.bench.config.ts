import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Standalone config for the render benchmark suite (`npm run bench`). Kept
// separate from vitest.config.ts so the benchmark dependencies (Radix, Headless
// UI) and the jsdom mount harness never load during the unit/a11y test runs.
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		include: ['bench/**/*.bench.{ts,tsx}'],
		benchmark: {
			include: ['bench/**/*.bench.{ts,tsx}'],
		},
	},
});
