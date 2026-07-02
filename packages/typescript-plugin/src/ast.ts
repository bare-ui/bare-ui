import type * as ts from "typescript";
import type { TsModule } from "./scan.js";

/** A JSX tag that carries attributes — `<X …>` or `<X … />`. */
export type JsxOpeningLikeElement =
	| ts.JsxOpeningElement
	| ts.JsxSelfClosingElement;

/** Any JSX element with a tag name — opening, self-closing, or closing. */
export type JsxTaggedElement = JsxOpeningLikeElement | ts.JsxClosingElement;

/** Innermost node whose full span contains `position`. */
export function findTokenAtPosition(
	sourceFile: ts.SourceFile,
	position: number,
): ts.Node | undefined {
	function find(node: ts.Node): ts.Node | undefined {
		if (position < node.getFullStart() || position > node.getEnd()) {
			return undefined;
		}
		let match: ts.Node | undefined;
		node.forEachChild((child) => {
			if (
				!match &&
				position >= child.getFullStart() &&
				position <= child.getEnd()
			) {
				match = find(child);
			}
		});
		return match ?? node;
	}
	return find(sourceFile);
}

/** Nearest ancestor (inclusive) satisfying `predicate`. */
export function findAncestor<T extends ts.Node>(
	node: ts.Node | undefined,
	predicate: (n: ts.Node) => n is T,
): T | undefined {
	for (let current = node; current; current = current.parent) {
		if (predicate(current)) return current;
	}
	return undefined;
}

/** Nearest ancestor that is a `<X …>`/`<X … />` opening-like element. */
export function findOpeningLikeElement(
	tsLib: TsModule,
	node: ts.Node | undefined,
): JsxOpeningLikeElement | undefined {
	return findAncestor(
		node,
		(n): n is JsxOpeningLikeElement =>
			tsLib.isJsxOpeningElement(n) || tsLib.isJsxSelfClosingElement(n),
	);
}

/** Nearest ancestor that is any JSX tag — opening, self-closing, or closing. */
export function findTaggedElement(
	tsLib: TsModule,
	node: ts.Node | undefined,
): JsxTaggedElement | undefined {
	return findAncestor(
		node,
		(n): n is JsxTaggedElement =>
			tsLib.isJsxOpeningElement(n) ||
			tsLib.isJsxSelfClosingElement(n) ||
			tsLib.isJsxClosingElement(n),
	);
}

/** Resolve a JSX tag name to a component and, for `X.Part`, its part. */
export function resolveTag(
	tsLib: TsModule,
	tagName: ts.JsxTagNameExpression,
): { name: string; part?: string } | undefined {
	if (tsLib.isIdentifier(tagName)) return { name: tagName.text };
	if (
		tsLib.isPropertyAccessExpression(tagName) &&
		tsLib.isIdentifier(tagName.expression) &&
		tsLib.isIdentifier(tagName.name)
	) {
		return { name: tagName.expression.text, part: tagName.name.text };
	}
	return undefined;
}
