import { defineConfig } from 'vitest/config'

// The metadata layer imports `@wire-ui/mcp/data`, which resolves to the built
// dist of the mcp package (turbo's `test`/`test:run` tasks depend on `^build`,
// so the catalog is built first). Node-environment tests only — no DOM needed.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
