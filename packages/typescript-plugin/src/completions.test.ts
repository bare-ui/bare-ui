import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import {
	buildDataAttributeEntries,
	getDataAttributeEntryDetails,
	resolveDataAttributeContext,
	WIRE_DATA_ATTRIBUTE_SOURCE,
} from "./completions.js";

// The Wire UI imports every JSX fixture below relies on. Prepended by `at()` so
// the `data-*` context only resolves when the tag is a real Wire UI import.
const WIRE_IMPORT =
	"import { Switch, Button, Accordion } from '@wire-ui/react'\n";

/**
 * Parse `prelude + code` where a single `|` in `code` marks the cursor,
 * returning the source file (marker stripped) and the absolute cursor offset.
 */
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

function attrNames(code: string, prelude?: string): string[] | undefined {
	const { sourceFile, position } = at(code, prelude);
	const context = resolveDataAttributeContext(ts, sourceFile, position);
	return context?.attributes.map((a) => a.name);
}

describe("resolveDataAttributeContext", () => {
	it("offers a component's data-* attributes inside its opening tag", () => {
		expect(attrNames("const x = <Switch data-| />")).toEqual([
			"data-state",
			"data-disabled",
		]);
	});

	it("works in the whitespace before the tag terminator", () => {
		expect(attrNames("const x = <Switch | />")).toEqual([
			"data-state",
			"data-disabled",
		]);
	});

	it("works inside a non-self-closing opening tag", () => {
		expect(attrNames("const x = <Switch |></Switch>")).toEqual([
			"data-state",
			"data-disabled",
		]);
	});

	it("filters by component — Button exposes its own attributes", () => {
		expect(attrNames("const x = <Button data-| />")).toEqual([
			"data-hover",
			"data-focus-visible",
			"data-active",
			"data-disabled",
			"data-autofocus",
		]);
	});

	it("scopes attributes to the compound part being edited", () => {
		// data-state applies to Item/Trigger/Content, not Root.
		expect(attrNames("const x = <Accordion.Item data-| />")).toEqual([
			"data-state",
		]);
		expect(
			attrNames("const x = <Accordion.Root data-| />"),
		).toBeUndefined();
	});

	it("offers every attribute on a bare compound tag (no part)", () => {
		expect(attrNames("const x = <Accordion data-| />")).toEqual([
			"data-state",
		]);
	});

	it("resolves aliased imports to the canonical component", () => {
		const alias = "import { Switch as Toggle } from '@wire-ui/vue'\n";
		expect(attrNames("const x = <Toggle data-| />", alias)).toEqual([
			"data-state",
			"data-disabled",
		]);
	});

	it("does not fire on the tag name itself", () => {
		expect(attrNames("const x = <Switc| />")).toBeUndefined();
		expect(attrNames("const x = <Switch| />")).toBeUndefined();
	});

	it("does not fire inside an attribute value (that is Day 5's job)", () => {
		expect(
			attrNames('const x = <Switch data-state="|" />'),
		).toBeUndefined();
		expect(
			attrNames("const x = <Switch data-state={|} />"),
		).toBeUndefined();
	});

	it("does not fire for a same-named component from another package", () => {
		const other = "import { Switch } from 'some-other-lib'\n";
		expect(attrNames("const x = <Switch data-| />", other)).toBeUndefined();
	});

	it("does not fire when the component is not imported at all", () => {
		expect(attrNames("const x = <Switch data-| />", "")).toBeUndefined();
	});

	it("does not fire for non-Wire tags", () => {
		expect(attrNames("const x = <div data-| />")).toBeUndefined();
		expect(attrNames("const x = <Unknown data-| />")).toBeUndefined();
	});

	it("does not fire for an unknown compound part", () => {
		expect(
			attrNames("const x = <Accordion.Nope data-| />"),
		).toBeUndefined();
	});

	it("does not fire in JSX children", () => {
		expect(attrNames("const x = <Switch>data-|</Switch>")).toBeUndefined();
	});
});

describe("buildDataAttributeEntries", () => {
	it("marks entries with the Wire UI source and a JSX-attribute kind", () => {
		const { sourceFile, position } = at("const x = <Switch data-| />");
		const context = resolveDataAttributeContext(ts, sourceFile, position)!;
		const entries = buildDataAttributeEntries(ts, context);

		expect(entries.map((e) => e.name)).toEqual([
			"data-state",
			"data-disabled",
		]);
		for (const entry of entries) {
			expect(entry.source).toBe(WIRE_DATA_ATTRIBUTE_SOURCE);
			expect(entry.kind).toBe(ts.ScriptElementKind.jsxAttribute);
			expect(entry.sortText.startsWith("01_wire_")).toBe(true);
		}
	});
});

describe("getDataAttributeEntryDetails", () => {
	it("documents the attribute with its value enum and a docs link", () => {
		const { sourceFile, position } = at("const x = <Switch data-| />");
		const context = resolveDataAttributeContext(ts, sourceFile, position)!;
		const details = getDataAttributeEntryDetails(
			ts,
			context,
			"data-state",
		)!;

		expect(details.name).toBe("data-state");
		const doc = details.documentation!.map((d) => d.text).join("");
		expect(doc).toContain("Reflects the switch state.");
		expect(doc).toContain("`checked`");
		expect(doc).toContain("`unchecked`");
		expect(doc).toContain("https://wire-ui.com/docs/components/switch");
	});

	it("returns undefined for an attribute not in context", () => {
		const { sourceFile, position } = at("const x = <Switch data-| />");
		const context = resolveDataAttributeContext(ts, sourceFile, position)!;
		expect(
			getDataAttributeEntryDetails(ts, context, "data-nope"),
		).toBeUndefined();
	});
});
