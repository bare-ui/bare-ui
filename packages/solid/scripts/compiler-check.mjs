/**
 * Solid 1.x compiler compatibility check.
 *
 * The Solid analogue of React's `react-compiler-healthcheck`: it runs every
 * component source file through the Solid JSX compiler (`babel-preset-solid`)
 * in BOTH output modes — client (`generate: 'dom'`) and server
 * (`generate: 'ssr'`, hydratable) — and fails if any file does not compile.
 *
 * This guarantees every component is compatible with the Solid 1.x compiler for
 * both client-side rendering and SSR/hydration, the way it is consumed in the
 * wild. Reactivity correctness (tracked-scope misuse, destructured props, etc.)
 * is enforced separately by `eslint-plugin-solid` via `npm run lint`.
 *
 * Run: `npm run compiler:check`.
 */
import { transformAsync } from '@babel/core';
import ts from '@babel/preset-typescript';
import solid from 'babel-preset-solid';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src');

/** Recursively collect component/source `.tsx` files (excluding tests/stories). */
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
		if (!entry.name.endsWith('.tsx')) continue;
		if (
			entry.name.endsWith('.test.tsx') ||
			entry.name.endsWith('.stories.tsx') ||
			entry.name.endsWith('.sr.test.tsx')
		) {
			continue;
		}
		files.push(full);
	}
	return files;
}

const MODES = [
	{ label: 'dom', options: { generate: 'dom', hydratable: true } },
	{ label: 'ssr', options: { generate: 'ssr', hydratable: true } },
];

async function main() {
	const files = (await collect(srcDir)).sort();
	const failures = [];
	let transforms = 0;

	for (const file of files) {
		const code = await readFile(file, 'utf8');
		for (const mode of MODES) {
			try {
				await transformAsync(code, {
					filename: file,
					babelrc: false,
					configFile: false,
					presets: [
						[ts, { isTSX: true, allExtensions: true }],
						[solid, mode.options],
					],
				});
				transforms++;
			} catch (err) {
				failures.push({ file: relative(srcDir, file), mode: mode.label, message: err.message });
			}
		}
	}

	const header = `Solid compiler check — ${files.length} components × ${MODES.length} modes (dom, ssr)`;
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
