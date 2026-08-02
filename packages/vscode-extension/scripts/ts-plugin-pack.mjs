// Puts the TypeScript Language Service plugin somewhere tsserver can actually
// find it.
//
// `contributes.typescriptServerPlugins[].name` is a *module specifier*, not a
// path: VS Code passes the extension's own directory as a `--pluginProbeLocation`
// and tsserver does a plain node resolution from `<extension>/node_modules`.
// Bundling the plugin into `dist/extension.js` does nothing for that — the
// extension host can require it, tsserver cannot. A .vsix without a real module
// directory loads the extension fine and then silently has no completions,
// hover, go-to-definition or diagnostics, because tsserver logged
// `Failed to load module` where nobody was looking. (Verified on Cursor 3.8.22;
// see the Day 19 notes.)
//
// So the plugin ships as its own tiny package inside the .vsix, the way Volar
// ships `vue-typescript-plugin-pack`. It cannot be called
// `@wire-ui/typescript-plugin` — npm workspaces owns that path in the dev tree
// as a symlink back to `packages/typescript-plugin`, and overwriting it would
// break every build in the repo. Hence the `-pack` name, which is also what the
// manifest and `configurePlugin()` have to use.
//
// Idempotent, and cheap enough to run from both `build` and `package`: the pack
// lives under `node_modules/`, which `npm install` may prune as extraneous, so
// "generated once, long ago" is not a safe assumption.

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PACK_NAME = "wire-ui-typescript-plugin-pack";
const SOURCE_PACKAGE = "@wire-ui/typescript-plugin";

const require = createRequire(import.meta.url);

// Resolves through the workspace symlink, so this always picks up the plugin
// build that just ran rather than a stale copy.
const entry = require.resolve(SOURCE_PACKAGE);
const version = require(`${SOURCE_PACKAGE}/package.json`).version;

const dir = fileURLToPath(new URL(`../node_modules/${PACK_NAME}/`, import.meta.url));
mkdirSync(dir, { recursive: true });

// The plugin's dist is already a self-contained CJS bundle (`typescript` stays
// external — tsserver hands it in through `init({ typescript })`), so the pack
// is a copy of it plus a manifest. The sourcemap comment goes: the .map is not
// shipped, and a dangling reference just makes tsserver's loader noisy.
const bundle = readFileSync(entry, "utf8").replace(
	/^\/\/# sourceMappingURL=.*$/m,
	"",
);
writeFileSync(`${dir}index.js`, bundle);

writeFileSync(
	`${dir}package.json`,
	`${JSON.stringify(
		{
			name: PACK_NAME,
			version,
			private: true,
			description: `Generated — do not edit. A copy of ${SOURCE_PACKAGE} at a module specifier tsserver can resolve from inside the .vsix. See scripts/ts-plugin-pack.mjs.`,
			main: "index.js",
		},
		null,
		2,
	)}\n`,
);

console.log(
	`ts-plugin-pack: ${PACK_NAME}@${version} (${(bundle.length / 1024).toFixed(0)} KB) from ${SOURCE_PACKAGE}`,
);
