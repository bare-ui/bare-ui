import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const projectRoot = dirname(fileURLToPath(import.meta.url))

// SSR smoke-test + hydration-fixture producer (`npm run test:ssr`, phase 1 of
// `test:hydrate`). Runs in a plain node environment — no DOM, pure
// `react-dom/server` `renderToString` — so it also proves the package has no
// module-level browser access (a DOM read would throw on import/render here).
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(projectRoot, './src'),
		},
	},
	test: {
		environment: 'node',
		include: ['src/test/ssr.test.tsx'],
	},
})
