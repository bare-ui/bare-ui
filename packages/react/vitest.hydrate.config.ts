import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const projectRoot = dirname(fileURLToPath(import.meta.url))

// Hydration-audit config (`npm run test:hydrate`, phase 2). Runs in jsdom and
// replays each server fixture captured by the SSR phase through a real
// `hydrateRoot()`, failing on any hydration mismatch (recoverable error or
// hydration `console.error`).
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/test/hydrate.test.tsx'],
	},
})
