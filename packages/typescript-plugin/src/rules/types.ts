// Shared vocabulary for the Wire UI diagnostic rules.
//
// Every rule owns one code in the `9xxxx` range (tsserver's own codes never
// reach it) so downstream surfaces — the ESLint plugin, future quick-fixes —
// can share rule identity instead of matching on message text.

import type * as ts from "typescript";
import type { JsxOpeningLikeElement } from "../ast.js";
import type { ComponentMetadata } from "../metadata/index.js";
import type { TsModule } from "../scan.js";

/** A single diagnostic rule: its stable name, code, and severity. */
export interface WireRule {
	name: string;
	code: number;
	severity: "error" | "warning";
}

export const WIRE_RULES = {
	missingRootWrapper: {
		name: "missing-root-wrapper",
		code: 90001,
		severity: "error",
	},
	compoundPartOutsideRoot: {
		name: "compound-part-outside-root",
		code: 90002,
		severity: "error",
	},
	requiredPairProps: {
		name: "required-pair-props",
		code: 90003,
		severity: "error",
	},
	misplacedClassName: {
		name: "misplaced-classname",
		code: 90004,
		severity: "warning",
	},
	preferDataStateSelector: {
		name: "prefer-data-state-selector",
		code: 90005,
		severity: "warning",
	},
	invalidDataStateValue: {
		name: "invalid-data-state-value",
		code: 90006,
		severity: "error",
	},
	managedDataAttribute: {
		name: "managed-data-attribute",
		code: 90007,
		severity: "warning",
	},
	dataAttributeWrongPart: {
		name: "data-attribute-wrong-part",
		code: 90008,
		severity: "warning",
	},
	asChildSingleChild: {
		name: "as-child-single-child",
		code: 90009,
		severity: "error",
	},
	presenceAttributeFalseSelector: {
		name: "presence-attribute-false-selector",
		code: 90010,
		severity: "warning",
	},
} as const satisfies Record<string, WireRule>;

/** A Wire UI JSX tag found in the source, resolved against the catalog. */
export interface WireElement {
	element: JsxOpeningLikeElement;
	component: ComponentMetadata;
	/** Local tag base — an alias when the component was imported `as`. */
	localName: string;
	/** The compound part written on the tag (`Accordion.Item` → `Item`). */
	part?: string;
	/**
	 * The part whose catalog entry governs this tag. A bare `<X>` on a compound
	 * component is its root, so it reads as `Root`.
	 */
	effectivePart: string;
}

/** What every rule receives: the file, its resolved Wire tags, and `report`. */
export interface RuleContext {
	tsLib: TsModule;
	sourceFile: ts.SourceFile;
	/** Local tag base → canonical component name, for ancestor resolution. */
	bindings: Map<string, string>;
	/** Every resolved Wire UI tag in the file, in source order. */
	elements: readonly WireElement[];
	/** Report against a node's span. */
	report(rule: WireRule, node: ts.Node, messageText: string): void;
	/** Report against an explicit span — for matches inside a string literal. */
	reportSpan(
		rule: WireRule,
		start: number,
		length: number,
		messageText: string,
	): void;
}

/** A rule is a pass over the prepared context that reports what it finds. */
export type Rule = (context: RuleContext) => void;
