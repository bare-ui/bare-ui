import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/components/**', 'src/composables/**'],
			exclude: ['src/**/*.stories.ts', 'src/**/*.types.ts'],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
});
