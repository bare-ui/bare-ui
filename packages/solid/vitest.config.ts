import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
	plugins: [solid()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/components/**', 'src/primitives/**'],
			exclude: ['src/**/*.stories.ts', 'src/**/*.stories.tsx', 'src/**/*.types.ts'],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
		conditions: ['development', 'browser'],
	},
});
