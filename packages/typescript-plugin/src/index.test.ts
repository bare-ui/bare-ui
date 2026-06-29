import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import initFactory from "./index.js";
import {
	collectWireComponentsInFile,
	collectWireComponentsInProgram,
	isWireUiModuleSpecifier,
} from "./scan.js";

function parse(code: string, fileName = "example.tsx"): ts.SourceFile {
	return ts.createSourceFile(
		fileName,
		code,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
}

describe("isWireUiModuleSpecifier", () => {
	it("matches Wire UI framework packages", () => {
		expect(isWireUiModuleSpecifier("@wire-ui/react")).toBe(true);
		expect(isWireUiModuleSpecifier("@wire-ui/vue")).toBe(true);
		expect(isWireUiModuleSpecifier("@wire-ui/solid")).toBe(true);
		expect(isWireUiModuleSpecifier("wire-ui")).toBe(true);
	});

	it("ignores unrelated packages", () => {
		expect(isWireUiModuleSpecifier("react")).toBe(false);
		expect(isWireUiModuleSpecifier("@radix-ui/react-accordion")).toBe(
			false,
		);
		expect(isWireUiModuleSpecifier("./wire-ui-helpers")).toBe(false);
	});
});

describe("collectWireComponentsInFile", () => {
	it("finds known components imported from a Wire UI package", () => {
		const sf = parse(`import { Accordion, Switch } from '@wire-ui/react'`);
		expect(collectWireComponentsInFile(ts, sf).sort()).toEqual([
			"Accordion",
			"Switch",
		]);
	});

	it("resolves the imported name through an alias", () => {
		const sf = parse(`import { Switch as Toggle } from '@wire-ui/react'`);
		expect(collectWireComponentsInFile(ts, sf)).toEqual(["Switch"]);
	});

	it("ignores non-Wire imports and unknown names", () => {
		const sf = parse(
			`import { useState } from 'react'\n` +
				`import { NotAComponent } from '@wire-ui/react'\n` +
				`import { Accordion } from '@wire-ui/react'`,
		);
		expect(collectWireComponentsInFile(ts, sf)).toEqual(["Accordion"]);
	});
});

describe("collectWireComponentsInProgram", () => {
	it("aggregates sightings across user files and skips declaration files", () => {
		const program = ts.createProgram({
			rootNames: ["a.tsx", "b.tsx", "types.d.ts"],
			options: { noResolve: true, noLib: true },
			host: stubCompilerHost({
				"a.tsx": `import { Accordion } from '@wire-ui/react'`,
				"b.tsx": `import { Switch } from '@wire-ui/vue'`,
				"types.d.ts": `import { Dialog } from '@wire-ui/react'`,
			}),
		});

		const sightings = collectWireComponentsInProgram(ts, program);
		const components = sightings.map((s) => s.component).sort();
		expect(components).toEqual(["Accordion", "Switch"]);
	});
});

describe("plugin factory", () => {
	it("exposes a create() that loads metadata and proxies the language service", () => {
		const logs: string[] = [];
		const passthroughSentinel = Symbol("original");
		// A real (empty) program so the scan path runs and reports it saw nothing.
		const emptyProgram = ts.createProgram({
			rootNames: [],
			options: { noLib: true, noResolve: true },
			host: stubCompilerHost({}),
		});
		const languageService = {
			getProgram: () => emptyProgram,
			getSemanticDiagnostics: () => passthroughSentinel,
		} as unknown as ts.LanguageService;

		const plugin = initFactory({ typescript: ts as never });
		expect(typeof plugin.create).toBe("function");

		const info = {
			languageService,
			project: {
				projectService: {
					logger: { info: (m: string) => logs.push(m) },
				},
			},
		};
		const proxy = plugin.create(info as never);

		// Logs that it loaded and what it saw (no program → nothing yet).
		expect(logs.some((l) => l.includes("plugin loaded"))).toBe(true);
		expect(logs.some((l) => l.includes("no Wire UI components"))).toBe(
			true,
		);

		// Passthrough: untouched members still resolve to the original behaviour.
		expect((proxy.getSemanticDiagnostics as () => unknown)()).toBe(
			passthroughSentinel,
		);
	});
});

/** Minimal CompilerHost backed by an in-memory file map (for program tests). */
function stubCompilerHost(files: Record<string, string>): ts.CompilerHost {
	return {
		getSourceFile: (name) => {
			const text = files[name];
			return text === undefined
				? undefined
				: ts.createSourceFile(
						name,
						text,
						ts.ScriptTarget.Latest,
						true,
						ts.ScriptKind.TSX,
					);
		},
		getDefaultLibFileName: () => "lib.d.ts",
		writeFile: () => {},
		getCurrentDirectory: () => "",
		getCanonicalFileName: (n) => n,
		useCaseSensitiveFileNames: () => true,
		getNewLine: () => "\n",
		fileExists: (name) => name in files,
		readFile: (name) => files[name],
	};
}
