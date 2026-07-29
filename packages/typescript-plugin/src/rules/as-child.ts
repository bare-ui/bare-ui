import type * as ts from "typescript";
import type { TsModule } from "../scan.js";
import { findAttribute, partDeclaresProp, tagText } from "./helpers.js";
import { WIRE_RULES, type Rule } from "./types.js";

/** Whether `asChild` was written truthily — bare, or `asChild={true}`. */
function isEnabled(tsLib: TsModule, attribute: ts.JsxAttribute): boolean {
	const initializer = attribute.initializer;
	if (!initializer) return true;
	return (
		tsLib.isJsxExpression(initializer) &&
		initializer.expression?.kind === tsLib.SyntaxKind.TrueKeyword
	);
}

/** Children that matter — JSX text that is only whitespace/newlines doesn't. */
function meaningfulChildren(
	tsLib: TsModule,
	children: ts.NodeArray<ts.JsxChild>,
): ts.JsxChild[] {
	return children.filter(
		(child) =>
			!(tsLib.isJsxText(child) && child.containsOnlyTriviaWhiteSpaces),
	);
}

/**
 * `as-child-single-child` — `asChild` merges the part's behaviour onto the
 * element you pass instead of rendering a default one, so it needs exactly one
 * element child to merge onto. Zero children, bare text, or several siblings
 * leave the behaviour with nowhere to go. Gated on the catalog declaring
 * `asChild` for the part, and skipped when the single child is an expression
 * (`{cond && <a/>}`) whose shape isn't knowable from the AST.
 */
export const asChildRule: Rule = (context) => {
	const { tsLib } = context;

	for (const usage of context.elements) {
		if (
			!partDeclaresProp(usage.component, usage.effectivePart, "asChild")
		) {
			continue;
		}

		const attribute = findAttribute(tsLib, usage.element, "asChild");
		if (!attribute || !isEnabled(tsLib, attribute)) continue;

		const tag = `<${tagText(usage)}>`;
		const parent = usage.element.parent;
		const children = tsLib.isJsxElement(parent)
			? meaningfulChildren(tsLib, parent.children)
			: [];

		if (children.length === 0) {
			context.report(
				WIRE_RULES.asChildSingleChild,
				attribute,
				`${tag} sets asChild but renders no child, so there is no element to merge its behaviour onto. Give it a single element child, or drop asChild.`,
			);
			continue;
		}

		if (children.length > 1) {
			context.report(
				WIRE_RULES.asChildSingleChild,
				attribute,
				`${tag} sets asChild but has ${children.length} children; asChild merges onto exactly one element. Wrap them in a single element, or drop asChild.`,
			);
			continue;
		}

		const only = children[0];
		if (tsLib.isJsxText(only)) {
			context.report(
				WIRE_RULES.asChildSingleChild,
				attribute,
				`${tag} sets asChild but its child is text; asChild needs an element to merge onto. Wrap the text in an element, or drop asChild.`,
			);
		}
	}
};
