import type * as ts from "typescript";
import type { JsxOpeningLikeElement } from "./ast.js";
import { asChildRule } from "./rules/as-child.js";
import { compoundRootRule } from "./rules/compound-root.js";
import { dataAttributesRule } from "./rules/data-attributes.js";
import { resolveWireElement } from "./rules/helpers.js";
import { misplacedClassNameRule } from "./rules/misplaced-classname.js";
import { requiredPairPropsRule } from "./rules/required-pair-props.js";
import { selectorRules } from "./rules/selectors.js";
import {
	WIRE_RULES,
	type Rule,
	type RuleContext,
	type WireElement,
	type WireRule,
} from "./rules/types.js";
import { wireImportBindings, type TsModule } from "./scan.js";

/** `source` field stamped on every diagnostic this plugin emits. */
export const WIRE_DIAGNOSTIC_SOURCE = "wire-ui";

export { WIRE_RULES } from "./rules/types.js";
export type { WireRule } from "./rules/types.js";

/** Every rule, in the order their diagnostics are emitted. */
const RULES: readonly Rule[] = [
	compoundRootRule,
	requiredPairPropsRule,
	misplacedClassNameRule,
	dataAttributesRule,
	asChildRule,
	selectorRules,
];

/** Visit every opening-like JSX tag in the file. */
function forEachOpeningLike(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	visit: (element: JsxOpeningLikeElement) => void,
): void {
	const walk = (node: ts.Node) => {
		if (
			tsLib.isJsxOpeningElement(node) ||
			tsLib.isJsxSelfClosingElement(node)
		) {
			visit(node);
		}
		node.forEachChild(walk);
	};
	walk(sourceFile);
}

/**
 * Compute Wire UI's semantic diagnostics for a source file: resolve the file's
 * Wire UI tags once, then run every rule over the result.
 *
 * JSX-only (React/Solid TSX, Vue-via-JSX); Vue `.vue` `<template>` markup is
 * Volar's domain. Import-gated + alias-aware, so unrelated same-named tags and
 * non-Wire markup produce nothing.
 */
export function computeWireDiagnostics(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
): ts.Diagnostic[] {
	const bindings = wireImportBindings(tsLib, sourceFile);
	if (bindings.size === 0) return [];

	const elements: WireElement[] = [];
	forEachOpeningLike(tsLib, sourceFile, (element) => {
		const resolved = resolveWireElement(tsLib, bindings, element);
		if (resolved) elements.push(resolved);
	});

	const diagnostics: ts.Diagnostic[] = [];

	const push = (
		rule: WireRule,
		start: number,
		length: number,
		messageText: string,
	) => {
		diagnostics.push({
			file: sourceFile,
			start,
			length,
			messageText,
			category:
				rule.severity === "warning"
					? tsLib.DiagnosticCategory.Warning
					: tsLib.DiagnosticCategory.Error,
			code: rule.code,
			source: WIRE_DIAGNOSTIC_SOURCE,
		});
	};

	const context: RuleContext = {
		tsLib,
		sourceFile,
		bindings,
		elements,
		report(rule, node, messageText) {
			const start = node.getStart(sourceFile);
			push(rule, start, node.getEnd() - start, messageText);
		},
		reportSpan: push,
	};

	for (const rule of RULES) rule(context);

	// Rules run in registration order; sort so squiggles read top-to-bottom.
	return diagnostics.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
}

/** The rule codes this plugin can emit — handy for hosts filtering by code. */
export const WIRE_RULE_CODES: readonly number[] = Object.values(WIRE_RULES).map(
	(rule) => rule.code,
);
