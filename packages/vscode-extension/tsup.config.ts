import { defineConfig } from 'tsup'

// VS Code loads the extension host as CommonJS and provides the `vscode`
// module at runtime, so it must stay external (never bundled).
//
// The component catalog is bundled in, by contrast: `vsce package` runs with
// `--no-dependencies`, so anything left external is simply absent from the
// .vsix when the extension host requires it.
export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  external: ['vscode'],
  noExternal: ['@wire-ui/typescript-plugin'],
})
