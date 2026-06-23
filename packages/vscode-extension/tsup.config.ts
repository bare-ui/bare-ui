import { defineConfig } from 'tsup'

// VS Code loads the extension host as CommonJS and provides the `vscode`
// module at runtime, so it must stay external (never bundled).
export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  external: ['vscode'],
})
