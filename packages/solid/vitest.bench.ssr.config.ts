import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// SSR benchmark config (`npm run bench:ssr`). Unlike React (whose
// renderToStaticMarkup runs against the same build as the client), Solid's
// server render needs a *separate* compile target: vite-plugin-solid must emit
// the SSR variant (`generate: 'ssr'`) and `solid-js/web` must resolve to its
// server build (the default Node `node`/`server` conditions). Runs in a plain
// node environment — no DOM, pure `renderToString`.
export default defineConfig({
	plugins: [solid({ solid: { generate: 'ssr', hydratable: false } })],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	ssr: {
		// Compile these deps through vite-plugin-solid's SSR transform rather
		// than loading their prebuilt (client) output.
		noExternal: ['solid-js', '@kobalte/core', 'corvu'],
	},
	test: {
		environment: 'node',
		setupFiles: ['./bench/setup.ts'],
		include: ['bench/render.ssr.bench.tsx'],
		benchmark: {
			include: ['bench/render.ssr.bench.tsx'],
		},
	},
});
