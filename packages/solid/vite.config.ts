import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
	plugins: [solid(), dts({ tsconfigPath: './tsconfig.build.json' })],
	publicDir: false,
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'WireUISolid',
			formats: ['es', 'cjs'],
			fileName: (format) => `wire-ui-solid.${format}.js`,
		},
		rollupOptions: {
			external: ['solid-js', 'solid-js/web', 'solid-js/store'],
			output: {
				globals: {
					'solid-js': 'Solid',
					'solid-js/web': 'SolidWeb',
					'solid-js/store': 'SolidStore',
				},
			},
		},
	},
});
