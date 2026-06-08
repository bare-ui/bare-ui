import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Resolve `solid-js/web`'s *server* build explicitly. Vitest injects the
// `browser` / `development` export conditions, which would otherwise pick the
// client build whose `renderToString` is a no-op stub (`isServer === false`).
// Plain Node resolution already lands on the server build, so we reuse that.
const solidWebServer = require.resolve('solid-js/web');

// SSR smoke-test config (`npm run test:ssr`). Solid's server render needs a
// *separate* compile target from the client: vite-plugin-solid emits the SSR
// variant (`generate: 'ssr'`) and `solid-js/web` is pinned to its server build.
// Runs in a plain node environment — no DOM, pure `renderToString` — so it also
// proves the package has no module-level browser access.
export default defineConfig({
	plugins: [solid({ solid: { generate: 'ssr', hydratable: true } })],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
			// Exact-match alias: only `solid-js/web` itself, not its subpaths.
			'solid-js/web': solidWebServer,
		},
		conditions: ['solid', 'node', 'import', 'default'],
	},
	ssr: {
		// Compile solid-js through vite-plugin-solid's SSR transform rather than
		// loading its prebuilt (client) output.
		noExternal: ['solid-js'],
	},
	test: {
		environment: 'node',
		include: ['src/test/ssr.test.tsx'],
	},
});
