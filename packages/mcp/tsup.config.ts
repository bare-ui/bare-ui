import { defineConfig } from 'tsup'

// Two outputs from one package:
//   - dist/index.js  : the MCP server CLI (needs the node shebang)
//   - dist/data.js   : a side-effect-free library export of the catalog data,
//                      consumed by the editor tooling (VS Code extension, TS
//                      plugin, ESLint plugin). Ships type declarations; no
//                      shebang so it imports cleanly.
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    target: 'node20',
    outDir: 'dist',
    clean: true,
    banner: { js: '#!/usr/bin/env node' },
  },
  {
    entry: { data: 'src/data/index.ts' },
    format: ['esm'],
    target: 'node20',
    outDir: 'dist',
    dts: true,
  },
])
