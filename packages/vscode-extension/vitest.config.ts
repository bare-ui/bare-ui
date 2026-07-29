import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// `vscode` only exists inside the extension host, so the specifier is aliased to
// a stub (src/test/vscode.ts) implementing the surface the extension touches.
// The pure modules — snippet bodies, editor context — need no stub at all.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      vscode: fileURLToPath(new URL('./src/test/vscode.ts', import.meta.url)),
    },
  },
})
