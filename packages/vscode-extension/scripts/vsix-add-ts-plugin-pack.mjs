// Adds the TypeScript plugin pack to a packaged .vsix.
//
// Why this is a separate step rather than a .vscodeignore rule: `vsce package
// --no-dependencies` globs the package directory with a hard-coded
// `ignore: 'node_modules/**'` *before* .vscodeignore is consulted, so no
// negation can re-include anything from there. The alternative — letting vsce
// compute the dependency tree — runs `npm list --production` inside a workspace
// package, which reports the repo root and every hoisted package (absolute
// paths outside this directory) and exits non-zero. Both routes are closed, and
// the plugin still has to arrive at `node_modules/<name>` inside the .vsix,
// because that is the only place tsserver looks. See scripts/ts-plugin-pack.mjs
// for why it looks there.
//
// A .vsix is an ordinary zip, so this reads the archive vsce produced and
// writes it back with two more entries. Idempotent: running it twice does not
// duplicate them.

import { createRequire } from "node:module";
import { readFileSync, renameSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import yauzl from "yauzl";
import yazl from "yazl";

const PACK_NAME = "wire-ui-typescript-plugin-pack";

const require = createRequire(import.meta.url);
const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const vsixPath = path.resolve(
	packageRoot,
	process.argv[2] ?? "wire-ui.vsix",
);
const packDir = path.join(packageRoot, "node_modules", PACK_NAME);

if (!existsSync(path.join(packDir, "index.js"))) {
	console.error(
		`vsix-add-ts-plugin-pack: ${PACK_NAME} is missing — run scripts/ts-plugin-pack.mjs first.`,
	);
	process.exit(1);
}

// Everything in a .vsix lives under `extension/`.
const additions = ["package.json", "index.js"].map((file) => ({
	entry: `extension/node_modules/${PACK_NAME}/${file}`,
	contents: readFileSync(path.join(packDir, file)),
}));

/** Reads every entry of a zip into memory. .vsix files are ~1 MB; this is fine. */
function readEntries(file) {
	return new Promise((resolve, reject) => {
		yauzl.open(file, { lazyEntries: true }, (error, zip) => {
			if (error) return reject(error);
			const entries = [];
			zip.on("error", reject);
			zip.on("entry", (entry) => {
				if (entry.fileName.endsWith("/")) return zip.readEntry(); // directory
				zip.openReadStream(entry, (streamError, stream) => {
					if (streamError) return reject(streamError);
					const chunks = [];
					stream.on("data", (chunk) => chunks.push(chunk));
					stream.on("error", reject);
					stream.on("end", () => {
						entries.push({
							entry: entry.fileName,
							contents: Buffer.concat(chunks),
						});
						zip.readEntry();
					});
				});
			});
			zip.on("end", () => resolve(entries));
			zip.readEntry();
		});
	});
}

const existing = await readEntries(vsixPath);
const kept = existing.filter(
	(file) => !additions.some((addition) => addition.entry === file.entry),
);

const zip = new yazl.ZipFile();
for (const file of [...kept, ...additions]) zip.addBuffer(file.contents, file.entry);
zip.end();

const temporary = `${vsixPath}.tmp`;
await new Promise((resolve, reject) => {
	const out = require("node:fs").createWriteStream(temporary);
	zip.outputStream.pipe(out);
	out.on("close", resolve);
	out.on("error", reject);
	zip.outputStream.on("error", reject);
});
renameSync(temporary, vsixPath);

const added = additions
	.map((addition) => `${(addition.contents.length / 1024).toFixed(0)} KB`)
	.join(" + ");
console.log(
	`vsix-add-ts-plugin-pack: added node_modules/${PACK_NAME} (${added}) to ${path.basename(vsixPath)}`,
);
