// Gates a release on the listing page being real.
//
// The README *is* the Marketplace page, and its first screen is what decides
// installs — an extension is judged on a GIF before it is judged on anything
// else. Nothing else in the pipeline can tell the difference between a listing
// with demos and a listing whose images 404, because a broken image is not a
// broken build. This is that check.
//
// Deliberately not part of CI: it fails until the GIFs are recorded, which is
// the correct state for a branch that has not recorded them, and the wrong state
// for every unrelated pull request. The release workflow runs it before
// publishing, and `npm run verify:listing` runs it on demand.

import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const readmePath = path.join(packageRoot, "README.md");
const readme = readFileSync(readmePath, "utf8");

const problems = [];

// Images the README points at, minus anything remote (which is not ours to
// verify, and which the Marketplace would rewrite anyway).
const referenced = [...readme.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)]
	.map(([, alt, target]) => ({ alt, target }))
	.filter(({ target }) => !/^https?:/.test(target));

if (referenced.length === 0) {
	problems.push(
		"README references no images at all — the listing needs its demos.",
	);
}

for (const { alt, target } of referenced) {
	const file = path.join(packageRoot, target);
	let size = 0;
	try {
		size = statSync(file).size;
	} catch {
		problems.push(`${target} is referenced by the README but does not exist.`);
		continue;
	}

	// A recorded demo is tens to hundreds of KB. Anything under 10 KB is a
	// placeholder someone renamed, which renders as a broken-looking listing.
	if (size < 10 * 1024) {
		problems.push(
			`${target} is only ${(size / 1024).toFixed(1)} KB — that is a placeholder, not a demo.`,
		);
	}

	if (target.endsWith(".gif")) {
		const header = readFileSync(file).subarray(0, 6).toString("latin1");
		if (header !== "GIF87a" && header !== "GIF89a") {
			problems.push(`${target} is named .gif but is not a GIF.`);
		}
	}

	// Alt text carries the demo for anyone who cannot see it, and for the
	// moments the image has not loaded yet.
	if (alt.trim().length < 15) {
		problems.push(`${target} needs alt text describing what the demo shows.`);
	}
}

// A listing that opens by apologising is not ready to be published.
if (/^\s*>\s*⚠️|work in progress|WIP\b/im.test(readme.split("\n## ")[0])) {
	problems.push(
		"README opens with a work-in-progress banner — remove it or do not publish.",
	);
}

if (problems.length > 0) {
	console.error("verify-listing: the Marketplace listing is not ready.\n");
	for (const problem of problems) console.error(`  ✗ ${problem}`);
	console.error(
		"\nSee 'Recording the listing GIFs' in RELEASING.md for what each one shows.",
	);
	process.exit(1);
}

console.log(
	`verify-listing: ${referenced.length} listing image(s) present and plausible.`,
);
