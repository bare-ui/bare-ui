import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import {
	buildHoverMarkdown,
	buildHoverQuickInfo,
	resolveHoverContext,
	type HoverContext,
} from "./hover.js";

const WIRE_IMPORT =
	"import { Switch, Button, Accordion } from '@wire-ui/react'\n";

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

function context(code: string, prelude?: string): HoverContext | undefined {
	const { sourceFile, position } = at(code, prelude);
	return resolveHoverContext(ts, sourceFile, position);
}

function markdown(code: string, prelude?: string): string | undefined {
	const ctx = context(code, prelude);
	return ctx && buildHoverMarkdown(ctx);
}

describe("resolveHoverContext", () => {
	it("resolves a root tag to its component, no part", () => {
		const ctx = context("const x = <Accordi|on />");
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBeUndefined();
	});

	it("resolves a compound part tag to component + part", () => {
		const ctx = context("const x = <Accordion.Trig|ger />");
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Trigger");
	});

	it("resolves when hovering the component name of a part tag", () => {
		const ctx = context("const x = <Acc|ordion.Trigger />");
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Trigger");
	});

	it("resolves on the closing tag", () => {
		const ctx = context("const x = <Accordion.Item></Accordion.It|em>");
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Item");
	});

	it("works for a non-compound component", () => {
		const ctx = context("const x = <Butt|on />");
		expect(ctx?.component.name).toBe("Button");
		expect(ctx?.part).toBeUndefined();
	});

	it("highlights the whole tag name span", () => {
		const { sourceFile, position } = at("const x = <Accordion.Trig|ger />");
		const ctx = resolveHoverContext(ts, sourceFile, position)!;
		const text = sourceFile.text.substr(ctx.span.start, ctx.span.length);
		expect(text).toBe("Accordion.Trigger");
	});

	it("resolves aliased imports to the canonical component", () => {
		const alias = "import { Accordion as Acc } from '@wire-ui/vue'\n";
		const ctx = context("const x = <Ac|c.Trigger />", alias);
		expect(ctx?.component.name).toBe("Accordion");
		expect(ctx?.part).toBe("Trigger");
	});

	it("does not fire on an attribute", () => {
		expect(context("const x = <Switch dat|a-state />")).toBeUndefined();
	});

	it("does not fire in JSX children", () => {
		expect(context("const x = <Switch>chil|d</Switch>")).toBeUndefined();
	});

	it("does not fire for an unknown compound part", () => {
		expect(context("const x = <Accordion.No|pe />")).toBeUndefined();
	});

	it("does not fire for a same-named component from another package", () => {
		const other = "import { Accordion } from 'some-other-lib'\n";
		expect(context("const x = <Accordi|on />", other)).toBeUndefined();
	});

	it("does not fire when the component is not imported", () => {
		expect(context("const x = <Accordi|on />", "")).toBeUndefined();
	});

	it("does not fire for a non-Wire tag", () => {
		expect(context("const x = <di|v />")).toBeUndefined();
	});
});

describe("buildHoverMarkdown", () => {
	it("renders the parts table, data-* table and docs link for a root", () => {
		const md = markdown("const x = <Accordi|on />")!;
		expect(md).toContain("**Accordion**");
		expect(md).toContain("Compound collapsible sections");
		// Parts table with props from the catalog.
		expect(md).toContain("**Parts**");
		expect(md).toContain("`Accordion.Root`");
		expect(md).toContain("`type`");
		expect(md).toContain("`Accordion.Trigger`");
		// data-* table.
		expect(md).toContain("**Data attributes**");
		expect(md).toContain("`data-state`");
		expect(md).toContain("`open` \\| `closed`");
		expect(md).toContain("Item, Trigger, Content");
		// Docs link.
		expect(md).toContain(
			"[Wire UI docs](https://wire-ui.com/docs/components/accordion)",
		);
	});

	it("titles a part hover and marks the focused part row", () => {
		const md = markdown("const x = <Accordion.Trig|ger />")!;
		expect(md).toContain("**Accordion.Trigger** — compound part of");
		expect(md).toContain("▸ `Accordion.Trigger`");
	});

	it("omits the parts table for a non-compound component", () => {
		const md = markdown("const x = <Butt|on />")!;
		expect(md).not.toContain("**Parts**");
		expect(md).toContain("**Data attributes**");
		expect(md).toContain("`data-hover`");
	});
});

describe("buildHoverQuickInfo", () => {
	it("returns QuickInfo carrying the tag span and markdown documentation", () => {
		const { sourceFile, position } = at("const x = <Accordi|on />");
		const ctx = resolveHoverContext(ts, sourceFile, position)!;
		const info = buildHoverQuickInfo(ts, ctx);

		expect(info.kind).toBe(ts.ScriptElementKind.classElement);
		expect(info.textSpan).toEqual(ctx.span);
		const display = info.displayParts!.map((p) => p.text).join("");
		expect(display).toBe("(Wire UI) Accordion");
		const doc = info.documentation!.map((p) => p.text).join("");
		expect(doc).toContain("**Parts**");
	});

	it("titles the QuickInfo with the part for a part hover", () => {
		const { sourceFile, position } = at("const x = <Accordion.Item| />");
		const ctx = resolveHoverContext(ts, sourceFile, position)!;
		const info = buildHoverQuickInfo(ts, ctx);
		const display = info.displayParts!.map((p) => p.text).join("");
		expect(display).toBe("(Wire UI) Accordion.Item");
	});
});
