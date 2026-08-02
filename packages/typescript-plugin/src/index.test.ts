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

		// Logs that it loaded.
		expect(logs.some((l) => l.includes("plugin loaded"))).toBe(true);

		// The project scan is deferred to the first request, and only then logs
		// what it saw (empty program → nothing yet).
		expect(logs.some((l) => l.includes("no Wire UI components"))).toBe(
			false,
		);
		proxy.getSemanticDiagnostics("example.tsx");
		expect(logs.some((l) => l.includes("no Wire UI components"))).toBe(
			true,
		);

		// Passthrough: with nothing of ours to add, the host's own result is what
		// comes back.
		expect(proxy.getSemanticDiagnostics("example.tsx")).toBe(
			passthroughSentinel,
		);
	});

	// The regression this guards: `create()` runs before the project has built
	// its graph, so a `getProgram()` from inside it leaves
	// `project.program !== languageService.getCurrentProgram()` and the next
	// `updateGraphWorker()` dies on `Debug.assert(oldProgram === this.program)`.
	// Cost: the first `updateOpen` request fails — i.e. the first file opened.
	it("touches no program while tsserver is still building the project", () => {
		let programRequests = 0;
		const languageService = {
			getProgram: () => {
				programRequests += 1;
				return undefined;
			},
			getSemanticDiagnostics: () => [],
		} as unknown as ts.LanguageService;

		const proxy = initFactory({ typescript: ts as never }).create({
			languageService,
			project: { projectService: { logger: { info: () => {} } } },
		} as never);

		expect(programRequests).toBe(0);

		// …and does ask once a request is being served, which is safe.
		proxy.getSemanticDiagnostics("example.tsx");
		expect(programRequests).toBeGreaterThan(0);
	});

	it("serves a Wire UI hover over a component tag, delegating otherwise", () => {
		const source =
			`import { Accordion } from '@wire-ui/react'\n` +
			`const x = <Accordion.Trigger />\n`;
		const program = ts.createProgram({
			rootNames: ["hover.tsx"],
			options: { noLib: true, noResolve: true },
			host: stubCompilerHost({ "hover.tsx": source }),
		});
		const hostSentinel = { kind: "host" } as unknown as ts.QuickInfo;
		const languageService = {
			getProgram: () => program,
			getQuickInfoAtPosition: () => hostSentinel,
		} as unknown as ts.LanguageService;

		const proxy = initFactory({ typescript: ts as never }).create({
			languageService,
			project: {
				projectService: { logger: { info: () => {} } },
			},
		} as never);

		// Cursor inside the `Trigger` tag name → Wire hover.
		const tagOffset = source.indexOf("Trigger") + 2;
		const hover = proxy.getQuickInfoAtPosition!("hover.tsx", tagOffset);
		expect(hover).not.toBe(hostSentinel);
		const doc = hover!.documentation!.map((p) => p.text).join("");
		expect(doc).toContain("**Accordion.Trigger**");
		expect(doc).toContain("**Data attributes**");

		// Cursor elsewhere (the `const` keyword) → host behaviour.
		const elsewhere = proxy.getQuickInfoAtPosition!(
			"hover.tsx",
			source.indexOf("const"),
		);
		expect(elsewhere).toBe(hostSentinel);
	});

	it("offers a docs definition on a Wire tag when the host has no source", () => {
		const source =
			`import { Button } from '@wire-ui/react'\n` +
			`const x = <Button />\n`;
		const program = ts.createProgram({
			rootNames: ["def.tsx"],
			options: { noLib: true, noResolve: true },
			host: stubCompilerHost({ "def.tsx": source }),
		});
		// The host resolves nothing (noResolve) — the docs fallback should fire.
		const languageService = {
			getProgram: () => program,
			getDefinitionAndBoundSpan: () => undefined,
			getDefinitionAtPosition: () => undefined,
		} as unknown as ts.LanguageService;

		const proxy = initFactory({ typescript: ts as never }).create({
			languageService,
			project: { projectService: { logger: { info: () => {} } } },
		} as never);

		const tagOffset = source.indexOf("Button", source.indexOf("<")) + 1;
		const result = proxy.getDefinitionAndBoundSpan!("def.tsx", tagOffset);
		expect(result?.definitions).toHaveLength(1);
		expect(result?.definitions![0].fileName).toBe(
			"https://wire-ui.com/docs/components/button",
		);
		const span = source.substr(
			result!.textSpan.start,
			result!.textSpan.length,
		);
		expect(span).toBe("Button");
	});

	it("keeps the host's source jump and delegates off-tag", () => {
		const source =
			`import { Button } from '@wire-ui/react'\n` +
			`const x = <Button />\n`;
		const program = ts.createProgram({
			rootNames: ["def.tsx"],
			options: { noLib: true, noResolve: true },
			host: stubCompilerHost({ "def.tsx": source }),
		});
		const sourceJump: ts.DefinitionInfoAndBoundSpan = {
			definitions: [
				{
					fileName: "/repo/src/components/button/Button.tsx",
					textSpan: { start: 0, length: 0 },
					kind: ts.ScriptElementKind.classElement,
					name: "Button",
					containerKind: ts.ScriptElementKind.unknown,
					containerName: "",
				},
			],
			textSpan: { start: 1, length: 6 },
		};
		const hostArray = sourceJump.definitions!;
		const languageService = {
			getProgram: () => program,
			getDefinitionAndBoundSpan: (_f: string, pos: number) =>
				pos === source.indexOf("Button", source.indexOf("<")) + 1
					? sourceJump
					: undefined,
			getDefinitionAtPosition: () => hostArray,
		} as unknown as ts.LanguageService;

		const proxy = initFactory({ typescript: ts as never }).create({
			languageService,
			project: { projectService: { logger: { info: () => {} } } },
		} as never);

		// On the tag with real source → host result passes through unchanged.
		const tagOffset = source.indexOf("Button", source.indexOf("<")) + 1;
		const onTag = proxy.getDefinitionAndBoundSpan!("def.tsx", tagOffset);
		expect(onTag?.definitions).toEqual(sourceJump.definitions);
		expect(onTag?.textSpan).toEqual(sourceJump.textSpan);

		// Off any Wire tag (the `const` keyword) → host behaviour, no docs target.
		const offTag = proxy.getDefinitionAndBoundSpan!(
			"def.tsx",
			source.indexOf("const"),
		);
		expect(offTag).toBeUndefined();
	});

	it("appends Wire diagnostics to the host's semantic diagnostics", () => {
		const source =
			`import { Input } from '@wire-ui/react'\n` +
			`const x = <Input.Field />\n`;
		const program = ts.createProgram({
			rootNames: ["diag.tsx"],
			options: { noLib: true, noResolve: true },
			host: stubCompilerHost({ "diag.tsx": source }),
		});
		const hostDiag = {
			file: undefined,
			start: 0,
			length: 1,
			messageText: "host",
			category: ts.DiagnosticCategory.Warning,
			code: 1,
		} as unknown as ts.Diagnostic;
		const languageService = {
			getProgram: () => program,
			getSemanticDiagnostics: () => [hostDiag],
		} as unknown as ts.LanguageService;

		const proxy = initFactory({ typescript: ts as never }).create({
			languageService,
			project: { projectService: { logger: { info: () => {} } } },
		} as never);

		const diags = proxy.getSemanticDiagnostics("diag.tsx");
		// Host diagnostic preserved, Wire diagnostic appended.
		expect(diags[0]).toBe(hostDiag);
		expect(diags).toHaveLength(2);
		expect(diags[1].source).toBe("wire-ui");
		expect(diags[1].messageText).toContain("<Input.Root>");
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
