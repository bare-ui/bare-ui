import { defineConfig } from 'tsup'

// VS Code loads the extension host as CommonJS and provides the `vscode`
// module at runtime, so it must stay external (never bundled).
//
// The component catalog is bundled in, by contrast: `vsce package` runs with
// `--no-dependencies`, so anything left external is simply absent from the
// .vsix when the extension host requires it.
//
// The target tracks the *oldest* host in `engines.vscode`, not the newest:
// VS Code 1.82 runs Electron 25 / Node 18, and forks lag upstream by months.
// Emitting for node20 would put syntax in the bundle that the oldest supported
// host — which is exactly where a fork sits — cannot parse.
export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  external: ['vscode'],
  noExternal: ['@wire-ui/typescript-plugin'],
})
