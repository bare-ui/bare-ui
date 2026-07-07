import { defineConfig } from 'vitest/config'

// The rules read the shared catalog from `@wire-ui/typescript-plugin/metadata`,
// which resolves to that package's built dist (turbo's `test`/`test:run` tasks
// depend on `^build`, so the metadata layer is built first). RuleTester picks up
// vitest's global `describe`/`it`, so the lint tests run as ordinary specs.
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
