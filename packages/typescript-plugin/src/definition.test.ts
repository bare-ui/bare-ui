import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import { resolveWireTagContext, type WireTagContext } from "./ast.js";
import {
	augmentDefinitionAndBoundSpan,
	augmentDefinitions,
	buildDocsDefinition,
	hasLocalSource,
} from "./definition.js";

const WIRE_IMPORT = "import { Button, Accordion } from '@wire-ui/react'\n";

/** Parse `prelude + code` with a single `|` cursor marker. */
function at(
	code: string,
	prelude = WIRE_IMPORT,
): { sourceFile: ts.SourceFile; position: number } {
	const cursor = code.indexOf("|");
	if (cursor < 0) throw new Error("test source needs a | cursor marker");
	const source = prelude + code.replace("|", "");
	const sourceFile = ts.createSourceFile(
		"example.tsx",
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
	return { sourceFile, position: prelude.length + cursor };
}

function context(code: string, prelude?: string): WireTagContext | undefined {
	const { sourceFile, position } = at(code, prelude);
	return resolveWireTagContext(ts, sourceFile, position);
}

/** A fake host definition pointing at `fileName`. */
function def(fileName: string): ts.DefinitionInfo {
	return {
		fileName,
		textSpan: { start: 0, length: 0 },
		kind: ts.ScriptElementKind.classElement,
		name: "x",
		containerKind: ts.ScriptElementKind.unknown,
		containerName: "",
	};
}

describe("resolveWireTagContext", () => {
	it("resolves a root tag to its component, no part", () => {
		const ctx = context("const x = <Butt|on />");
		expect(ctx?.component.name).toBe("Button");
		expect(ctx?.part).toBeUndefined();
	});

	it("resolves a compound part tag to component + part", () => {
		const ctx = context("const x = <Accordion.Trig|ger />");
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Trigger");
	});

	it("resolves on the closing tag", () => {
		const ctx = context("const x = <Accordion.Item></Accordion.It|em>");
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Item");
	});

	it("resolves aliased imports to the canonical component", () => {
		const alias = "import { Accordion as Acc } from '@wire-ui/solid'\n";
		const ctx = context("const x = <Ac|c.Trigger />", alias);
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Trigger");
	});

	it("spans the whole tag name", () => {
		const { sourceFile, position } = at("const x = <Accordion.Trig|ger />");
		const ctx = resolveWireTagContext(ts, sourceFile, position)!;
		const text = sourceFile.text.substr(ctx.span.start, ctx.span.length);
		expect(text).toBe("Accordion.Trigger");
	});

	it("does not fire on an attribute, unknown part, or non-Wire tag", () => {
		expect(context("const x = <Button dat|a-hover />")).toBeUndefined();
		expect(context("const x = <Accordion.No|pe />")).toBeUndefined();
		expect(context("const x = <di|v />")).toBeUndefined();
	});

	it("does not fire for an unimported / same-named component", () => {
		expect(context("const x = <Butt|on />", "")).toBeUndefined();
		const other = "import { Button } from 'some-other-lib'\n";
		expect(context("const x = <Butt|on />", other)).toBeUndefined();
	});
});

describe("hasLocalSource", () => {
	it("is true when any definition is a non-declaration file", () => {
		expect(hasLocalSource([def("/repo/src/Button.tsx")])).toBe(true);
		expect(
			hasLocalSource([
				def("/node_modules/@wire-ui/react/dist/index.d.ts"),
				def("/repo/src/Button.tsx"),
			]),
		).toBe(true);
	});

	it("is false for only declaration files or no definitions", () => {
		expect(
			hasLocalSource([
				def("/node_modules/@wire-ui/react/dist/index.d.ts"),
			]),
		).toBe(false);
		expect(hasLocalSource([def("/types/global.d.mts")])).toBe(false);
		expect(hasLocalSource([])).toBe(false);
	});
});

describe("buildDocsDefinition", () => {
	it("targets the component docs URL for a root", () => {
		const ctx = context("const x = <Butt|on />")!;
		const d = buildDocsDefinition(ts, ctx);
		expect(d.fileName).toBe("https://wire-ui.com/docs/components/button");
		expect(d.name).toBe("Button");
		expect(d.containerName).toBe("Wire UI");
		expect(d.unverified).toBe(true);
	});

	it("names the part for a compound tag", () => {
		const ctx = context("const x = <Accordion.Trig|ger />")!;
		const d = buildDocsDefinition(ts, ctx);
		expect(d.name).toBe("Accordion.Trigger");
		expect(d.fileName).toBe(
			"https://wire-ui.com/docs/components/accordion",
		);
	});
});

describe("augmentDefinitions", () => {
	it("keeps host source, adds nothing, when real source exists", () => {
		const ctx = context("const x = <Butt|on />")!;
		const prior = [def("/repo/src/Button.tsx")];
		expect(augmentDefinitions(ts, ctx, prior)).toEqual(prior);
	});

	it("appends the docs target when only declarations exist", () => {
		const ctx = context("const x = <Butt|on />")!;
		const prior = [def("/node_modules/@wire-ui/react/dist/index.d.ts")];
		const result = augmentDefinitions(ts, ctx, prior);
		expect(result).toHaveLength(2);
		expect(result[0]).toBe(prior[0]);
		expect(result[1].fileName).toBe(
			"https://wire-ui.com/docs/components/button",
		);
	});

	it("returns just the docs target when the host found nothing", () => {
		const ctx = context("const x = <Butt|on />")!;
		const result = augmentDefinitions(ts, ctx, []);
		expect(result).toHaveLength(1);
		expect(result[0].fileName).toBe(
			"https://wire-ui.com/docs/components/button",
		);
	});
});

describe("augmentDefinitionAndBoundSpan", () => {
	it("preserves the host bound span when present", () => {
		const ctx = context("const x = <Butt|on />")!;
		const prior: ts.DefinitionInfoAndBoundSpan = {
			definitions: [def("/repo/src/Button.tsx")],
			textSpan: { start: 5, length: 6 },
		};
		const result = augmentDefinitionAndBoundSpan(ts, ctx, prior);
		expect(result.textSpan).toEqual(prior.textSpan);
		expect(result.definitions).toEqual(prior.definitions);
	});

	it("falls back to the tag-name span and docs target when the host is empty", () => {
		const ctx = context("const x = <Butt|on />")!;
		const result = augmentDefinitionAndBoundSpan(ts, ctx, undefined);
		expect(result.textSpan).toEqual(ctx.span);
		expect(result.definitions).toHaveLength(1);
		expect(result.definitions![0].fileName).toBe(
			"https://wire-ui.com/docs/components/button",
		);
	});
});
