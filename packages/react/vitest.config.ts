import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const projectRoot = dirname(fileURLToPath(import.meta.url))

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
			include: ['src/components/**', 'src/hooks/**'],
			exclude: ['src/**/*.stories.tsx', 'src/**/*.types.ts'],
		},
		projects: [
			{
				// Fast jsdom unit tests for hooks and utilities.
				extends: true,
				plugins: [react()],
				test: {
					name: 'unit',
					environment: 'jsdom',
					globals: true,
					setupFiles: ['./src/test/setup.ts'],
					include: ['src/**/*.test.{ts,tsx}'],
					// The SSR + hydration audits run under their own configs
					// (test:ssr / test:hydrate): node for the server phase, and a real
					// hydrateRoot() that consumes the fixtures the SSR phase writes.
					exclude: ['src/test/ssr.test.tsx', 'src/test/hydrate.test.tsx'],
				},
			},
			{
				// Every story rendered in a real browser and run through axe-core
				// (via @storybook/addon-a11y with `a11y.test = 'error'`).
				extends: true,
				plugins: [
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
})
