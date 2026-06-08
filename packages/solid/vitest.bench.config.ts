import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Client mount benchmark config (`npm run bench:mount`). vite-plugin-solid
// compiles JSX for the DOM (client) here, so `solid-js/web` must resolve to its
// client build too — the `browser` condition forces that (otherwise Node picks
// the server build and the client-compiled output calls into the server runtime).
// `dev: false` + omitting the `development` condition runs the *production*
// Solid build: representative of shipped code and free of dev-only reactive-root
// warnings. Kept separate from vitest.config.ts so the benchmark dependencies
// (Kobalte, Corvu) never load during the unit/a11y test runs.
export default defineConfig({
	plugins: [solid({ dev: false })],
	resolve: {
		conditions: ['browser'],
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./bench/setup.ts'],
		include: ['bench/render.mount.bench.tsx'],
		benchmark: {
			include: ['bench/render.mount.bench.tsx'],
		},
	},
});
