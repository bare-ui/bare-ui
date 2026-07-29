import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import {
	computeWireDiagnostics,
	WIRE_DIAGNOSTIC_SOURCE,
	WIRE_RULES,
	WIRE_RULE_CODES,
} from "../diagnostics.js";
import { getComponentMetadata } from "../metadata/index.js";

const WIRE_IMPORT =
	"import { Accordion, Button, Input, Modal, Tabs, Toggle } from '@wire-ui/react'\n";

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

/** The source text a diagnostic underlines. */
function underlined(diagnostic: ts.Diagnostic): string {
	return (diagnostic.file as ts.SourceFile).text.substr(
		diagnostic.start!,
		diagnostic.length!,
	);
}

function only(diagnostics: ts.Diagnostic[]): ts.Diagnostic {
	expect(diagnostics).toHaveLength(1);
	return diagnostics[0];
}

describe("rule table", () => {
	it("gives every rule a unique code in the 9xxxx range", () => {
		expect(new Set(WIRE_RULE_CODES).size).toBe(WIRE_RULE_CODES.length);
		expect(WIRE_RULE_CODES.every((code) => code >= 90000)).toBe(true);
	});

	it("covers ten distinct mistake patterns", () => {
		expect(WIRE_RULE_CODES).toHaveLength(10);
	});
});

describe("required-pair-props", () => {
	it("flags invalidType written without errorMessage", () => {
		const diagnostic = only(
			diagnose(
				"const x = <Input.Root invalidType={error}><Input.Field /></Input.Root>",
			),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.requiredPairProps.code);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Error);
		expect(diagnostic.source).toBe(WIRE_DIAGNOSTIC_SOURCE);
		expect(diagnostic.messageText).toContain("errorMessage");
		expect(underlined(diagnostic)).toBe("invalidType={error}");
	});

	it("accepts the pair written together", () => {
		expect(
			diagnose(
				"const x = <Input.Root invalidType={error} errorMessage={messages}><Input.Field /></Input.Root>",
			),
		).toEqual([]);
	});

	it("says nothing when only errorMessage is set", () => {
		expect(
			diagnose(
				"const x = <Input.Root errorMessage={messages}><Input.Field /></Input.Root>",
			),
		).toEqual([]);
	});

	it("stays quiet when a spread could carry the partner prop", () => {
		expect(
			diagnose(
				"const x = <Input.Root invalidType={error} {...rest}><Input.Field /></Input.Root>",
			),
		).toEqual([]);
	});

	it("only fires on parts the catalog gives both props", () => {
		// Accordion.Item has neither prop, so writing them is someone else's problem.
		expect(
			diagnose(
				"const x = <Accordion><Accordion.Item invalidType={e} /></Accordion>",
			),
		).toEqual([]);
	});

	it("uses the local alias in the message", () => {
		const alias = "import { Input as Field } from '@wire-ui/vue'\n";
		const diagnostic = only(
			diagnose("const x = <Field.Root invalidType={e} />", alias),
		);
		expect(diagnostic.messageText).toContain("<Field.Root>");
	});
});

describe("misplaced-classname", () => {
	it("flags className on a context-only part", () => {
		const diagnostic = only(
			diagnose(
				"const x = <Modal.Root className='shell'><Modal.Content /></Modal.Root>",
			),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.misplacedClassName.code);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(diagnostic.messageText).toContain("renders no element");
		expect(diagnostic.messageText).toContain("<Modal.Content>");
		expect(underlined(diagnostic)).toBe("className='shell'");
	});

	it("flags the Vue-via-JSX spelling too", () => {
		const diagnostic = only(
			diagnose(
				"const x = <Modal.Root><Modal.Portal class='shell' /></Modal.Root>",
			),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.misplacedClassName.code);
		expect(diagnostic.messageText).toContain("class is dropped");
	});

	it("treats a bare compound tag as its root", () => {
		const diagnostic = only(
			diagnose("const x = <Modal className='shell' />"),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.misplacedClassName.code);
		expect(diagnostic.messageText).toContain("<Modal>");
	});

	it("leaves parts that render markup alone", () => {
		expect(
			diagnose(
				"const x = <Modal.Root><Modal.Content className='panel' /></Modal.Root>",
			),
		).toEqual([]);
	});

	it("leaves components with no context-only parts alone", () => {
		expect(
			diagnose(
				"const x = <Input.Root className='field'><Input.Field /></Input.Root>",
			),
		).toEqual([]);
	});
});

describe("prefer-data-state-selector", () => {
	it("flags an aria-expanded selector and names the data-state value", () => {
		const diagnostic = only(
			diagnose(`const css = '[aria-expanded="true"] { color: red }'`),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.preferDataStateSelector.code);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(diagnostic.messageText).toContain('[data-state="open"]');
		expect(underlined(diagnostic)).toBe('[aria-expanded="true"]');
	});

	it("maps the false case too", () => {
		const diagnostic = only(
			diagnose(`const css = "[aria-expanded='false'] {}"`),
		);
		expect(diagnostic.messageText).toContain('[data-state="closed"]');
	});

	it("reads template literals, including their spans", () => {
		const diagnostics = diagnose(
			'const css = `[aria-pressed="true"] { ${rule} } [aria-selected="true"] {}`',
		);
		expect(diagnostics).toHaveLength(2);
		expect(diagnostics[0].messageText).toContain('[data-state="on"]');
		expect(diagnostics[1].messageText).toContain('[data-state="active"]');
		expect(underlined(diagnostics[1])).toBe('[aria-selected="true"]');
	});

	it("ignores aria states with no data-state equivalent", () => {
		// Checked state is the presence attribute `data-checked`, not a data-state.
		expect(diagnose(`const css = '[aria-checked="true"] {}'`)).toEqual([]);
		expect(diagnose(`const css = '[aria-label="Close"] {}'`)).toEqual([]);
	});

	it("stays out of files that never import Wire UI", () => {
		expect(diagnose(`const css = '[aria-expanded="true"] {}'`, "")).toEqual(
			[],
		);
	});
});

describe("invalid-data-state-value", () => {
	it("flags a data-state value the component never emits", () => {
		const diagnostic = only(
			diagnose(
				"const x = <Accordion><Accordion.Item data-state='opend' /></Accordion>",
			),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.invalidDataStateValue.code);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Error);
		expect(diagnostic.messageText).toContain("open, closed");
	});

	it("falls through to managed-data-attribute for a valid value", () => {
		const diagnostic = only(
			diagnose(
				"const x = <Accordion><Accordion.Item data-state='open' /></Accordion>",
			),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.managedDataAttribute.code);
	});

	it("says nothing when the value is dynamic", () => {
		expect(
			diagnose(
				"const x = <Accordion><Accordion.Item data-state={state} /></Accordion>",
			).map((d) => d.code),
		).toEqual([WIRE_RULES.managedDataAttribute.code]);
	});
});

describe("managed-data-attribute", () => {
	it("flags a data-* the component sets itself", () => {
		const diagnostic = only(
			diagnose("const x = <Toggle data-disabled='' />"),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.managedDataAttribute.code);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(diagnostic.messageText).toContain("overwritten");
	});

	it("leaves a consumer's own data-* alone", () => {
		expect(diagnose("const x = <Toggle data-testid='save' />")).toEqual([]);
	});
});

describe("data-attribute-wrong-part", () => {
	it("flags an attribute the catalog scopes to other parts", () => {
		const diagnostic = only(
			diagnose(
				"const x = <Input.Root data-invalid=''><Input.Field /></Input.Root>",
			),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.dataAttributeWrongPart.code);
		expect(diagnostic.messageText).toContain("<Input.Field>");
	});

	it("accepts the attribute on a part it applies to", () => {
		const diagnostics = diagnose(
			"const x = <Input.Root><Input.Field data-invalid='' /></Input.Root>",
		);
		// Still managed by the component, but it is at least on the right part.
		expect(diagnostics.map((d) => d.code)).toEqual([
			WIRE_RULES.managedDataAttribute.code,
		]);
	});
});

describe("as-child-single-child", () => {
	it("flags a text-only child", () => {
		const diagnostic = only(
			diagnose("const x = <Button asChild>Save</Button>"),
		);
		expect(diagnostic.code).toBe(WIRE_RULES.asChildSingleChild.code);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Error);
		expect(underlined(diagnostic)).toBe("asChild");
	});

	it("flags several element children", () => {
		const diagnostic = only(
			diagnose("const x = <Button asChild><a /><b /></Button>"),
		);
		expect(diagnostic.messageText).toContain("2 children");
	});

	it("flags a self-closing tag with no child at all", () => {
		const diagnostic = only(diagnose("const x = <Button asChild />"));
		expect(diagnostic.messageText).toContain("renders no child");
	});

	it("accepts exactly one element child, whitespace and all", () => {
		expect(
			diagnose(
				"const x = <Button asChild>\n\t<a href='/'>Go</a>\n</Button>",
			),
		).toEqual([]);
	});

	it("accepts asChild={false}", () => {
		expect(
			diagnose("const x = <Button asChild={false}>Save</Button>"),
		).toEqual([]);
	});

	it("says nothing when the only child is an expression", () => {
		expect(diagnose("const x = <Button asChild>{link}</Button>")).toEqual(
			[],
		);
	});

	it("only fires on parts the catalog gives asChild", () => {
		expect(
			diagnose("const x = <Tabs.Trigger asChild>Tab</Tabs.Trigger>").map(
				(d) => d.code,
			),
		).toEqual([WIRE_RULES.missingRootWrapper.code]);
	});
});

describe("presence-attribute-false-selector", () => {
	it('flags a presence attribute matched against "false"', () => {
		const diagnostic = only(
			diagnose(`const css = '[data-hover="false"] {}'`),
		);
		expect(diagnostic.code).toBe(
			WIRE_RULES.presenceAttributeFalseSelector.code,
		);
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(diagnostic.messageText).toContain(":not([data-hover])");
	});

	it("leaves valued attributes alone", () => {
		// `data-state` carries values, so `"false"` there is a different mistake.
		expect(diagnose(`const css = '[data-state="false"] {}'`)).toEqual([]);
	});

	it("leaves attributes outside the catalog alone", () => {
		expect(diagnose(`const css = '[data-testid="false"] {}'`)).toEqual([]);
	});
});

describe("catalog derivation", () => {
	it("reads context-only parts from the catalog, not a local table", () => {
		expect(getComponentMetadata("Modal")?.contextOnlyParts).toEqual([
			"Root",
			"Portal",
		]);
		expect(getComponentMetadata("Input")?.contextOnlyParts).toEqual([]);
	});
});

describe("ordering", () => {
	it("emits diagnostics in source order", () => {
		const diagnostics = diagnose(
			"const x = <Modal.Root className='a'><Modal.Content /></Modal.Root>\nconst y = <Input.Root invalidType={e} />",
		);
		expect(diagnostics).toHaveLength(2);
		expect(diagnostics[0].start!).toBeLessThan(diagnostics[1].start!);
	});
});
