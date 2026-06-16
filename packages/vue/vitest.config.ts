import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
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
	},
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/components/**', 'src/composables/**'],
			exclude: ['src/**/*.stories.ts', 'src/**/*.types.ts'],
		},
		projects: [
			{
				// Fast jsdom unit + screen-reader tests.
				extends: true,
				plugins: [vue()],
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
				plugins: [
					vue(),
					storybookTest({ configDir: resolve(projectRoot, '.storybook') }),
				],
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
