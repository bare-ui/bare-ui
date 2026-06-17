/**
 * Vue 3 compiler compatibility check.
 *
 * The Vue analogue of React's `react-compiler-healthcheck` (and Solid's
 * `scripts/compiler-check.mjs`): it runs every Single-File Component through the
 * official Vue SFC compiler (`vue/compiler-sfc`) in BOTH output modes — client
 * (`ssr: false`, the browser render function via `@vue/compiler-dom`) and server
 * (`ssr: true`, the SSR render function via `@vue/compiler-ssr`) — and fails if
 * any file does not compile.
 *
 * This guarantees every component is compatible with the Vue 3 compiler for both
 * client-side rendering and SSR/hydration, the way it is consumed in the wild.
 * For `<script setup>` SFCs the template is compiled inline (exactly as the SFC
 * compiler does it), so script + template are validated together per mode.
 * Reactivity/template correctness lint is enforced separately by
 * `eslint-plugin-vue` via `npm run lint`; full type-checking by `npm run typecheck`.
 *
 * Run: `npm run compiler:check`.
 */
import { parse, compileScript, compileTemplate } from 'vue/compiler-sfc';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src');

/** Recursively collect SFC (`.vue`) source files (excluding any `test` dirs). */
async function collect(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'test') continue;
			files.push(...(await collect(full)));
			continue;
		}
		if (!entry.name.endsWith('.vue')) continue;
		files.push(full);
	}
	return files;
}

const MODES = [
	{ label: 'dom', ssr: false },
	{ label: 'ssr', ssr: true },
];

/** Compile a single SFC source in one mode; throws on any compiler error. */
function compileSfc(code, filename, ssr) {
	// A stable, non-empty scope id is all the compiler needs here.
	const id = relative(srcDir, filename);
	const { descriptor, errors } = parse(code, { filename });
	if (errors.length) throw new Error(errors[0].message ?? String(errors[0]));

	const hasScriptSetup = !!descriptor.scriptSetup;
	const hasScript = hasScriptSetup || !!descriptor.script;
	const hasTemplate = !!descriptor.template;
	const isTs = (descriptor.scriptSetup ?? descriptor.script)?.lang === 'ts';
	const expressionPlugins = isTs ? ['typescript'] : undefined;

	if (hasScript) {
		// For `<script setup>` + `<template>` the SFC compiler inlines the template
		// into the setup render function, so this single call exercises both the
		// script and the (dom/ssr) template compiler for this mode.
		compileScript(descriptor, {
			id,
			inlineTemplate: hasScriptSetup && hasTemplate,
			templateOptions: { ssr, compilerOptions: { expressionPlugins } },
		});
	}

	// Plain `<script>` (non-setup) SFCs with a template are not inlined above, so
	// compile the template explicitly to cover the dom/ssr render function.
	if (hasTemplate && !hasScriptSetup) {
		const { errors: tplErrors } = compileTemplate({
			source: descriptor.template.content,
			filename,
			id,
			ssr,
			compilerOptions: { expressionPlugins },
		});
		if (tplErrors.length) {
			const first = tplErrors[0];
			throw new Error(typeof first === 'string' ? first : (first.message ?? String(first)));
		}
	}
}

async function main() {
	const files = (await collect(srcDir)).sort();
	const failures = [];
	let transforms = 0;

	for (const file of files) {
		const code = await readFile(file, 'utf8');
		for (const mode of MODES) {
			try {
				compileSfc(code, file, mode.ssr);
				transforms++;
			} catch (err) {
				failures.push({ file: relative(srcDir, file), mode: mode.label, message: err.message });
			}
		}
	}

	const header = `Vue compiler check — ${files.length} SFCs × ${MODES.length} modes (dom, ssr)`;
	if (failures.length === 0) {
		console.log(`✓ ${header}: ${transforms}/${transforms} compiled.`);
		return;
	}

	console.error(`✗ ${header}: ${failures.length} failure(s).\n`);
	for (const f of failures) {
		console.error(`  [${f.mode}] ${f.file}\n    ${f.message.split('\n')[0]}`);
	}
	process.exit(1);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
