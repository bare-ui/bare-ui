import { defineConfig } from 'tsup'

// ESLint loads plugins via `require()`, so the entry must be CommonJS. The
// shared metadata layer is consumed from `@wire-ui/typescript-plugin/metadata`
// (itself CJS with the @wire-ui/mcp catalog bundled in), so nothing from the
// catalog needs re-bundling here — the plugin package stays thin.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
})
