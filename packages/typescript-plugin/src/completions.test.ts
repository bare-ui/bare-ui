import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import {
	buildDataAttributeEntries,
	buildDataAttributeValueEntries,
	getDataAttributeEntryDetails,
	getDataAttributeValueEntryDetails,
	resolveDataAttributeContext,
	resolveDataAttributeValueContext,
	WIRE_DATA_ATTRIBUTE_SOURCE,
	WIRE_DATA_VALUE_SOURCE,
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

function valueNames(code: string, prelude?: string): string[] | undefined {
	const { sourceFile, position } = at(code, prelude);
	const context = resolveDataAttributeValueContext(ts, sourceFile, position);
	return context?.values;
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

describe("resolveDataAttributeValueContext", () => {
	it("completes the value enum inside a data-state string", () => {
		expect(valueNames('const x = <Switch data-state="|" />')).toEqual([
			"checked",
			"unchecked",
		]);
	});

	it("completes different values per component", () => {
		const acc = "import { Accordion } from '@wire-ui/solid'\n";
		expect(
			valueNames('const x = <Accordion.Item data-state="|" />', acc),
		).toEqual(["open", "closed"]);
	});

	it("works with a partial value already typed", () => {
		expect(valueNames('const x = <Switch data-state="che|" />')).toEqual([
			"checked",
			"unchecked",
		]);
	});

	it("works on an unterminated string while typing", () => {
		expect(valueNames('const x = <Switch data-state="|')).toEqual([
			"checked",
			"unchecked",
		]);
	});

	it("resolves through aliased imports", () => {
		const alias = "import { Switch as Toggle } from '@wire-ui/vue'\n";
		expect(
			valueNames('const x = <Toggle data-state="|" />', alias),
		).toEqual(["checked", "unchecked"]);
	});

	it("returns a replacement span covering the string content", () => {
		const { sourceFile, position } = at(
			'const x = <Switch data-state="ch|" />',
		);
		const ctx = resolveDataAttributeValueContext(ts, sourceFile, position)!;
		const text = sourceFile.text.substr(
			ctx.replacementSpan.start,
			ctx.replacementSpan.length,
		);
		expect(text).toBe("ch");
	});

	it("does not fire for a presence-flag attribute with no values", () => {
		expect(
			valueNames('const x = <Switch data-disabled="|" />'),
		).toBeUndefined();
	});

	it("does not fire when the attribute is invalid for the part", () => {
		// data-state does not apply to Accordion.Root.
		const acc = "import { Accordion } from '@wire-ui/react'\n";
		expect(
			valueNames('const x = <Accordion.Root data-state="|" />', acc),
		).toBeUndefined();
	});

	it("does not fire in an expression value", () => {
		expect(
			valueNames("const x = <Switch data-state={|} />"),
		).toBeUndefined();
	});

	it("does not fire in the attribute-name position", () => {
		expect(valueNames("const x = <Switch data-| />")).toBeUndefined();
	});

	it("does not fire for a non-Wire component", () => {
		const other = "import { Switch } from 'some-other-lib'\n";
		expect(
			valueNames('const x = <Switch data-state="|" />', other),
		).toBeUndefined();
	});
});

describe("buildDataAttributeValueEntries", () => {
	it("emits string entries tagged with the value source and replacement span", () => {
		const { sourceFile, position } = at(
			'const x = <Switch data-state="|" />',
		);
		const context = resolveDataAttributeValueContext(
			ts,
			sourceFile,
			position,
		)!;
		const entries = buildDataAttributeValueEntries(ts, context);

		expect(entries.map((e) => e.name)).toEqual(["checked", "unchecked"]);
		for (const entry of entries) {
			expect(entry.source).toBe(WIRE_DATA_VALUE_SOURCE);
			expect(entry.kind).toBe(ts.ScriptElementKind.string);
			expect(entry.replacementSpan).toEqual(context.replacementSpan);
		}
	});
});

describe("getDataAttributeValueEntryDetails", () => {
	it("documents the value with the attribute description and docs link", () => {
		const { sourceFile, position } = at(
			'const x = <Switch data-state="|" />',
		);
		const context = resolveDataAttributeValueContext(
			ts,
			sourceFile,
			position,
		)!;
		const details = getDataAttributeValueEntryDetails(
			ts,
			context,
			"checked",
		)!;

		expect(details.name).toBe("checked");
		const doc = details.documentation!.map((d) => d.text).join("");
		expect(doc).toContain('data-state="checked"');
		expect(doc).toContain("Reflects the switch state.");
		expect(doc).toContain("https://wire-ui.com/docs/components/switch");
	});

	it("returns undefined for a value not in the enum", () => {
		const { sourceFile, position } = at(
			'const x = <Switch data-state="|" />',
		);
		const context = resolveDataAttributeValueContext(
			ts,
			sourceFile,
			position,
		)!;
		expect(
			getDataAttributeValueEntryDetails(ts, context, "bogus"),
		).toBeUndefined();
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
