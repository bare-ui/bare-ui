import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import {
	computeWireDiagnostics,
	WIRE_DIAGNOSTIC_SOURCE,
	WIRE_RULES,
} from "./diagnostics.js";

const WIRE_IMPORT = "import { Input, Accordion } from '@wire-ui/react'\n";

function diagnose(code: string, prelude = WIRE_IMPORT): ts.Diagnostic[] {
	const sourceFile = ts.createSourceFile(
		"example.tsx",
		prelude + code,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
	return computeWireDiagnostics(ts, sourceFile);
}

/** The tag-name text a diagnostic underlines. */
function underlined(d: ts.Diagnostic): string {
	return (d.file as ts.SourceFile).text.substr(d.start!, d.length!);
}

describe("missing-root-wrapper", () => {
	it("flags a part with no root anywhere in the file", () => {
		const diags = diagnose("const x = <Input.Field />");
		expect(diags).toHaveLength(1);
		expect(diags[0].code).toBe(WIRE_RULES.missingRootWrapper.code);
		expect(diags[0].source).toBe(WIRE_DIAGNOSTIC_SOURCE);
		expect(diags[0].category).toBe(ts.DiagnosticCategory.Error);
		expect(diags[0].messageText).toContain("<Input.Root>");
		expect(underlined(diags[0])).toBe("Input.Field");
	});

	it("underlines only the offending tag name", () => {
		const diags = diagnose(
			"const x = <Accordion.Trigger>Open</Accordion.Trigger>",
		);
		expect(diags).toHaveLength(1);
		expect(underlined(diags[0])).toBe("Accordion.Trigger");
	});

	it("flags every orphaned part", () => {
		const diags = diagnose("const x = <><Input.Label /><Input.Field /></>");
		expect(diags).toHaveLength(2);
		expect(
			diags.every((d) => d.code === WIRE_RULES.missingRootWrapper.code),
		).toBe(true);
	});

	it("uses the local alias in the message", () => {
		const alias = "import { Input as Form } from '@wire-ui/solid'\n";
		const diags = diagnose("const x = <Form.Field />", alias);
		expect(diags).toHaveLength(1);
		expect(diags[0].messageText).toContain("<Form.Field>");
		expect(diags[0].messageText).toContain("<Form.Root>");
		// The canonical component name still appears in the explanation.
		expect(diags[0].messageText).toContain("Input");
	});
});

describe("compound-part-outside-root", () => {
	it("flags a part when a root for it exists elsewhere in the file", () => {
		const diags = diagnose("const x = <><Input.Root /><Input.Field /></>");
		expect(diags).toHaveLength(1);
		expect(diags[0].code).toBe(WIRE_RULES.compoundPartOutsideRoot.code);
		expect(diags[0].messageText).toContain("renders outside");
		expect(underlined(diags[0])).toBe("Input.Field");
	});
});

describe("valid usage produces no diagnostics", () => {
	it("part nested directly in its root", () => {
		expect(
			diagnose("const x = <Input.Root><Input.Field /></Input.Root>"),
		).toEqual([]);
	});

	it("part nested through intermediate markup", () => {
		expect(
			diagnose(
				"const x = <Input.Root><div><Input.Field /></div></Input.Root>",
			),
		).toEqual([]);
	});

	it("bare component tag acts as the root", () => {
		expect(
			diagnose("const x = <Accordion><Accordion.Item /></Accordion>"),
		).toEqual([]);
	});

	it("the root part itself is never flagged", () => {
		expect(diagnose("const x = <Input.Root />")).toEqual([]);
	});

	it("an unknown compound part is ignored", () => {
		expect(diagnose("const x = <Input.Nope />")).toEqual([]);
	});
});

describe("gating", () => {
	it("ignores non-Wire and unimported tags", () => {
		expect(diagnose("const x = <div><span /></div>")).toEqual([]);
		expect(diagnose("const x = <Input.Field />", "")).toEqual([]);
	});

	it("ignores a same-named component from another package", () => {
		const other = "import { Input } from 'some-other-lib'\n";
		expect(diagnose("const x = <Input.Field />", other)).toEqual([]);
	});

	it("nests parts of different compounds independently", () => {
		const diags = diagnose(
			"const x = <Input.Root><Input.Field /><Accordion.Item /></Input.Root>",
		);
		// Input.Field is fine; Accordion.Item has no Accordion root.
		expect(diags).toHaveLength(1);
		expect(underlined(diags[0])).toBe("Accordion.Item");
		expect(diags[0].code).toBe(WIRE_RULES.missingRootWrapper.code);
	});
});
