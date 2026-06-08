import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Hydration-audit config (`npm run test:hydrate`, phase 2). Components are
// compiled for the *client* with hydration enabled (`generate: 'dom',
// hydratable: true`) and run in jsdom, where `solid-js/web` correctly resolves
// to its client build (the one that owns `hydrate()`). It replays the server
// markup captured by the SSR phase through a real `hydrate()` and fails on any
// `console.error` / `console.warn` — i.e. any hydration mismatch.
export default defineConfig({
	plugins: [solid({ solid: { generate: 'dom', hydratable: true } })],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/test/hydrate.test.tsx'],
	},
});
