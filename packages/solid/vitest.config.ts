import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
		conditions: ['development', 'browser'],
	},
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/components/**', 'src/primitives/**'],
			exclude: ['src/**/*.stories.ts', 'src/**/*.stories.tsx', 'src/**/*.types.ts'],
		},
		projects: [
			{
				// Fast jsdom unit + screen-reader-semantics tests for components,
				// hooks and utilities.
				extends: true,
				plugins: [solid()],
				test: {
					name: 'unit',
					environment: 'jsdom',
					globals: true,
					setupFiles: ['./src/test/setup.ts'],
					include: ['src/**/*.test.{ts,tsx}'],
				},
			},
			{
				// Every story rendered in a real browser and run through axe-core
				// (via @storybook/addon-a11y with `a11y.test = 'error'`).
				extends: true,
				plugins: [storybookTest({ configDir: resolve(projectRoot, '.storybook') })],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
	},
});
