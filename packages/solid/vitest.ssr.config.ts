import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Pin solid-js to its *server* builds. Vitest injects the `browser` /
// `development` export conditions, which would otherwise resolve solid-js to its
// client/dev build — where `renderToString` is a no-op stub AND `onMount` /
// `createEffect` run during render (instead of being server no-ops). Both the
// reactivity core (`solid-js`) and the renderer (`solid-js/web`) must be the
// server build for a faithful SSR run; plain Node resolution already lands on
// them. Exact-match regexes so subpaths like `solid-js/store` are untouched.
// Use the ESM server builds (not .cjs): solid-js/web's server build imports
// `sharedConfig` from the bare `solid-js` specifier, so resolving both as ESM +
// `dedupe` gives the renderer and the components a *single* shared core instance
// (a single `sharedConfig`). Mixing CJS builds yields two instances and the
// "getNextContextId cannot be used under non-hydrating context" error.
const solidCoreServer = require.resolve('solid-js').replace(/\.cjs$/, '.js');
const solidWebServer = require.resolve('solid-js/web').replace(/\.cjs$/, '.js');

// SSR smoke-test + hydration-fixture producer (`npm run test:ssr`, phase 1 of
// `test:hydrate`). vite-plugin-solid emits the SSR variant (`generate: 'ssr'`)
// and solid-js is pinned to its server build. Runs in a plain node environment —
// no DOM, pure `renderToString` — so it also proves the package has no
// module-level browser access.
export default defineConfig({
	plugins: [solid({ solid: { generate: 'ssr', hydratable: true } })],
	resolve: {
		alias: [
			{ find: /^@\//, replacement: `${resolve(projectRoot, './src')}/` },
			{ find: /^solid-js$/, replacement: solidCoreServer },
			{ find: /^solid-js\/web$/, replacement: solidWebServer },
		],
		conditions: ['solid', 'node', 'import', 'default'],
		// A single shared copy of the core (one `sharedConfig`) for renderer + components.
		dedupe: ['solid-js', 'solid-js/web'],
	},
	ssr: {
		noExternal: ['solid-js'],
	},
	test: {
		environment: 'node',
		include: ['src/test/ssr.test.tsx'],
	},
});
