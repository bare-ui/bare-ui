// The Day 15 exit criterion: the command produces a *compiling* compound
// component. Nothing short of running the real compiler proves that, so each
// scaffold is generated into a throwaway project and typechecked with the
// repo's own tsc / vue-tsc against the real `@wire-ui/*` type definitions.
//
// The projects are created under this package's `node_modules/.tmp` so that
// Node's upward module resolution finds the workspace packages — a folder in
// the OS temp directory could not resolve `@wire-ui/react` at all.

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import type { Framework } from "@wire-ui/typescript-plugin/metadata";
import { scaffoldFiles } from "./templates/index.js";

const packageRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../..",
);
const repoRoot = path.resolve(packageRoot, "../..");
const sandbox = path.join(packageRoot, "node_modules", ".tmp");

/** Whether a framework package has been built — its types are what we compile against. */
function typesBuilt(framework: Framework): boolean {
	return fs.existsSync(
		path.join(repoRoot, "packages", framework, "dist", "index.d.ts"),
	);
}

function binary(name: string): string {
	return path.join(
		repoRoot,
		"node_modules",
		".bin",
		process.platform === "win32" ? `${name}.cmd` : name,
	);
}

const TSCONFIG: Record<Framework, Record<string, unknown>> = {
	react: { jsx: "react-jsx" },
	solid: { jsx: "preserve", jsxImportSource: "solid-js" },
	vue: {},
};

/** Writes a scaffold into its own project and returns the project directory. */
function materialize(
	framework: Framework,
	name: string,
	parts: string[],
): string {
	const project = path.join(sandbox, `${framework}-${name}`);
	fs.rmSync(project, { recursive: true, force: true });
	fs.mkdirSync(project, { recursive: true });

	for (const file of scaffoldFiles(framework, name, parts)) {
		const target = path.join(project, file.path);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, file.contents, "utf8");
	}

	fs.writeFileSync(
		path.join(project, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					target: "ES2022",
					lib: ["ES2022", "DOM", "DOM.Iterable"],
					module: "ESNext",
					moduleResolution: "Bundler",
					strict: true,
					noEmit: true,
					// The generated files are what is under test; the libraries they
					// import are the workspace's problem, not this test's.
					skipLibCheck: true,
					esModuleInterop: true,
					...TSCONFIG[framework],
				},
				include: ["**/*.ts", "**/*.tsx", "**/*.vue"],
			},
			null,
			2,
		),
		"utf8",
	);

	return project;
}

/** Runs a compiler over the project, returning its output on failure. */
function typecheck(command: string, project: string): string | undefined {
	try {
		execFileSync(binary(command), ["--noEmit", "-p", "tsconfig.json"], {
			cwd: project,
			encoding: "utf8",
			stdio: "pipe",
		});
		return undefined;
	} catch (error) {
		const result = error as { stdout?: string; stderr?: string };
		return `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
	}
}

afterAll(() => {
	fs.rmSync(sandbox, { recursive: true, force: true });
});

describe.each([
	["react", "tsc"],
	["solid", "tsc"],
	["vue", "vue-tsc"],
] as const)("the %s scaffold compiles", (framework, compiler) => {
	// A framework package that has not been built has no .d.ts to compile
	// against. Skipping is honest; silently passing would not be.
	const runnable = typesBuilt(framework) && fs.existsSync(binary(compiler));

	it.runIf(runnable)(
		"with the default parts",
		() => {
			const project = materialize(framework, "Rating", [
				"Trigger",
				"Content",
			]);
			expect(typecheck(compiler, project)).toBeUndefined();
		},
		120_000,
	);

	it.runIf(runnable)(
		"with an unconventional part list",
		() => {
			const project = materialize(framework, "Gallery", [
				"Item",
				"Caption",
			]);
			expect(typecheck(compiler, project)).toBeUndefined();
		},
		120_000,
	);

	it.skipIf(runnable)("skipped — build the workspace packages first", () => {
		expect(runnable).toBe(false);
	});
});
