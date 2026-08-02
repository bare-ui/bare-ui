// Builds the .vsix. Three steps, in this order, because each needs the last:
//
//   1. ts-plugin-pack        — put the TS Language Service plugin at a module
//                              specifier tsserver can resolve
//   2. vsce package          — the archive itself, per .vscodeignore
//   3. vsix-add-ts-plugin-pack — add (1) to (2), which vsce cannot do itself
//
// It lives in one script so that `npm run package` and the test that verifies
// the artifact run the *same* steps. Splitting them across a shell `&&` chain
// meant the test could only package to the default path, and a test that
// re-implements the packaging is a test of the re-implementation.
//
// Usage: node scripts/package.mjs [--out <file>]

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const repoRoot = path.resolve(packageRoot, "../..");

const flag = process.argv.indexOf("--out");
const out = path.resolve(
	packageRoot,
	flag === -1 ? "wire-ui.vsix" : process.argv[flag + 1],
);

/** npm hoists workspace binaries to the repo root; both locations are valid. */
function binary(name) {
	const executable = process.platform === "win32" ? `${name}.cmd` : name;
	const local = path.join(packageRoot, "node_modules", ".bin", executable);
	return existsSync(local)
		? local
		: path.join(repoRoot, "node_modules", ".bin", executable);
}

function run(command, args) {
	execFileSync(command, args, { cwd: packageRoot, stdio: "inherit" });
}

run(process.execPath, [path.join(packageRoot, "scripts/ts-plugin-pack.mjs")]);
run(binary("vsce"), ["package", "--no-dependencies", "--out", out]);
run(process.execPath, [
	path.join(packageRoot, "scripts/vsix-add-ts-plugin-pack.mjs"),
	out,
]);
