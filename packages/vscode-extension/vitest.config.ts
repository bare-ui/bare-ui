import { defineConfig } from 'vitest/config'

// The extension's intelligence lives in @wire-ui/typescript-plugin (metadata
// layer, completions, diagnostics), which carries its own tests. This package
// has no tests of its own yet — activation/feature wiring lands in later 0.8
// days — so don't fail the suite when there are none.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
})
