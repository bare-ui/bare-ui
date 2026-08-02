// What the .vsix actually contains — the only place the extension's behaviour
// stops being decided by this repo's node_modules layout.
//
// The bug these tests exist for: `contributes.typescriptServerPlugins[].name`
// is resolved by *tsserver*, as a module, from the installed extension's own
// directory. Bundling the plugin into `dist/extension.js` satisfies the
// extension host and nothing else. Everything from Day 4 to Day 11 —
// completions, hover, go-to-definition, all ten diagnostics — lives behind that
// resolution, and when it fails it fails into a tsserver log file no user will
// ever open. It worked in the F5 dev host the whole time, because there the
// workspace symlink answers the require.
//
// So this packages for real and opens the result. `vsce ls` would not do: the
// pack is added to the archive after vsce writes it (see
// scripts/vsix-add-ts-plugin-pack.mjs), so only the .vsix itself is the truth.

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import yauzl from "yauzl";

const packageRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const manifest = JSON.parse(
	fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"),
) as { contributes: { typescriptServerPlugins: { name: string }[] } };

const pluginName = manifest.contributes.typescriptServerPlugins[0].name;
const packDir = path.join(packageRoot, "node_modules", pluginName);

// Packaging needs the bundle the build produces; there is nothing to assert
// about a .vsix that cannot be built.
const built = fs.existsSync(path.join(packageRoot, "dist", "extension.js"));
if (!built) {
	console.warn(
		"[package.test] skipped: dist/extension.js is missing — run `npm run build --workspace wire-ui` first.",
	);
}

// The pack lives under node_modules, where `npm install` prunes it as
// extraneous — so its presence says nothing about the build, only about when
// install last ran. Regenerating it is what `build` and `package` both do.
beforeAll(() => {
	if (!built) return;
	execFileSync(
		process.execPath,
		[path.join(packageRoot, "scripts", "ts-plugin-pack.mjs")],
		{ cwd: packageRoot, stdio: "pipe" },
	);
});

describe("the TypeScript plugin pack", () => {
	it.skipIf(!built)(
		"resolves from the extension root, the way tsserver resolves it",
		() => {
			// tsserver is handed the extension directory as a plugin probe location
			// and requires the plugin name from `<that>/node_modules`. This is that
			// call.
			const require = createRequire(path.join(packageRoot, "index.js"));
			const entry = require.resolve(pluginName);
			expect(entry.startsWith(packDir)).toBe(true);

			// A plugin is a factory returning `{ create }` — anything else loads and
			// then does nothing.
			const init = require(entry) as (module: {
				typescript: unknown;
			}) => { create: unknown };
			expect(typeof init).toBe("function");
			expect(typeof init({ typescript: {} }).create).toBe("function");
		},
	);

	it.skipIf(!built)("carries no dangling sourcemap reference", () => {
		const code = fs.readFileSync(path.join(packDir, "index.js"), "utf8");
		expect(code).not.toMatch(/sourceMappingURL/);
	});
});

describe("the packaged .vsix", () => {
	const output = path.join(
		os.tmpdir(),
		`wire-ui-package-test-${process.pid}.vsix`,
	);
	let shipped: string[] = [];

	beforeAll(async () => {
		if (!built) return;
		// The real packaging script — the same one `npm run package` runs.
		execFileSync(
			process.execPath,
			[path.join(packageRoot, "scripts", "package.mjs"), "--out", output],
			{ cwd: packageRoot, encoding: "utf8", stdio: "pipe" },
		);
		shipped = (await entryNames(output)).map((name) =>
			name.replace(/^extension\//, ""),
		);
	}, 120_000);

	afterAll(() => {
		fs.rmSync(output, { force: true });
	});

	it.skipIf(!built)("contains the TypeScript plugin pack", () => {
		expect(shipped).toContain(`node_modules/${pluginName}/package.json`);
		expect(shipped).toContain(`node_modules/${pluginName}/index.js`);
	});

	it.skipIf(!built)("contains the extension bundle and its icon", () => {
		expect(shipped).toContain("dist/extension.js");
		expect(shipped).toContain("assets/icon.png");
	});

	it.skipIf(!built)("ships no sources, sourcemaps or maintainer docs", () => {
		expect(shipped.filter((file) => file.endsWith(".map"))).toEqual([]);
		expect(shipped.filter((file) => file.startsWith("src/"))).toEqual([]);
		expect(shipped.filter((file) => file.startsWith("scripts/"))).toEqual([]);
		expect(shipped).not.toContain("RELEASING.md");
	});

	it.skipIf(!built)(
		"drags in no other node_modules — the pack is the exception, not the rule",
		() => {
			const bundled = shipped.filter((file) =>
				file.startsWith("node_modules/"),
			);
			expect(
				bundled.filter(
					(file) => !file.startsWith(`node_modules/${pluginName}/`),
				),
			).toEqual([]);
		},
	);
});

/** Every file entry in a zip, by name. */
function entryNames(file: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		yauzl.open(file, { lazyEntries: true }, (error, zip) => {
			if (error || !zip) return reject(error);
			const names: string[] = [];
			zip.on("error", reject);
			zip.on("entry", (entry: { fileName: string }) => {
				if (!entry.fileName.endsWith("/")) names.push(entry.fileName);
				zip.readEntry();
			});
			zip.on("end", () => resolve(names));
			zip.readEntry();
		});
	});
}
