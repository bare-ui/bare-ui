import { defineConfig, type Plugin } from 'vite';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

// The CJS entry (dist/index.cjs) needs a CommonJS-flavored declaration file
// (index.d.cts), otherwise node16/nodenext resolution treats the ESM .d.ts as
// "masquerading as ESM". The bundled types have no internal relative imports,
// so a straight copy is valid for both module systems.
function emitCjsTypes(): Plugin {
	return {
		name: 'wire-ui:emit-cjs-types',
		closeBundle() {
			const dir = resolve(__dirname, 'dist');
			copyFileSync(resolve(dir, 'index.d.ts'), resolve(dir, 'index.d.cts'));
		},
	};
}

export default defineConfig({
	plugins: [
		solid(),
		dts({
			tsconfigPath: './tsconfig.build.json',
			// Bundle all declarations into a single index.d.ts with no internal
			// relative imports. This keeps node16/nodenext type resolution valid
			// (extensionless relative imports in .d.ts files do not resolve there).
			rollupTypes: true,
		}),
		emitCjsTypes(),
	],
	publicDir: false,
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		// Preserve the source module graph (one output file per source module)
		// so consumer bundlers can drop entire unused component files. A single
		// concatenated bundle is NOT tree-shakeable at the named-export level:
		// importing one component would otherwise pull in nearly the whole
		// library (the barrel re-exports and cross-component references defeat
		// consumer dead-code elimination).
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
		},
		rollupOptions: {
			external: ['solid-js', 'solid-js/web', 'solid-js/store'],
			output: [
				{
					format: 'es',
					preserveModules: true,
					preserveModulesRoot: 'src',
					entryFileNames: '[name].js',
					dir: 'dist',
				},
				{
					format: 'cjs',
					preserveModules: true,
					preserveModulesRoot: 'src',
					entryFileNames: '[name].cjs',
					dir: 'dist',
					exports: 'named',
				},
			],
		},
	},
});
