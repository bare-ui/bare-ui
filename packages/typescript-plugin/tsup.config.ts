import { defineConfig } from 'tsup'

// tsserver loads Language Service plugins via `require()`, so the plugin entry
// must be CommonJS. `typescript` is provided by the host tsserver at runtime —
// the plugin receives it through `init({ typescript })` — so it stays external
// and is never bundled. The @wire-ui/mcp catalog (ESM) *is* bundled in, so the
// published plugin is self-contained when a foreign editor loads it.
//
// Two outputs from one package:
//   - dist/index.js    : the ts-server plugin entry point (CJS)
//   - dist/metadata.js : the shared, side-effect-free metadata layer, consumed
//                        by the VS Code extension (and future editor tooling)
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    metadata: 'src/metadata/index.ts',
  },
  format: ['cjs'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  external: ['typescript'],
  // @wire-ui/mcp ships an ESM-only `./data` export; bundle it in so the CJS
  // plugin can require() it and stays self-contained when a foreign editor's
  // tsserver loads it. (tsup externalizes `dependencies` by default.)
  noExternal: ['@wire-ui/mcp'],
})
