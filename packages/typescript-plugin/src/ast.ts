import type * as ts from "typescript";
import {
	getComponentMetadata,
	type ComponentMetadata,
} from "./metadata/index.js";
import { wireImportBindings, type TsModule } from "./scan.js";

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

/**
 * A Wire UI JSX tag resolved from the cursor: the component, the compound part
 * when the tag is `X.Part`, and the tag-name span the cursor sits on.
 */
export interface WireTagContext {
	component: ComponentMetadata;
	/** The compound part under the cursor (`Accordion.Trigger` → `Trigger`). */
	part?: string;
	/** Span of the tag name (`Accordion` or `Accordion.Trigger`). */
	span: ts.TextSpan;
}

/**
 * Resolve the Wire UI tag under `position`, or `undefined` unless the cursor is
 * over the *tag name* of a Wire UI JSX element — a root (`<Accordion>`), a part
 * (`<Accordion.Trigger>`), or the matching closing tag (`</Accordion.Item>`).
 * Import-gated and alias-aware via `wireImportBindings` (rejects same-named,
 * unimported, and non-Wire tags); an unknown compound part (`<Accordion.Nope>`)
 * returns `undefined` so tsserver's own behaviour shows. Shared by hover
 * (Day 7) and go-to-definition (Day 8).
 */
export function resolveWireTagContext(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	position: number,
): WireTagContext | undefined {
	const token = findTokenAtPosition(sourceFile, position);
	if (!token) return undefined;

	const element = findTaggedElement(tsLib, token);
	if (!element) return undefined;

	// Only fire when the cursor is on the tag name, not its attributes/children.
	const tagName = element.tagName;
	if (
		position < tagName.getStart(sourceFile) ||
		position > tagName.getEnd()
	) {
		return undefined;
	}

	const tag = resolveTag(tsLib, tagName);
	if (!tag) return undefined;

	const componentName = wireImportBindings(tsLib, sourceFile).get(tag.name);
	if (!componentName) return undefined;

	const component = getComponentMetadata(componentName);
	if (!component) return undefined;
	// `Accordion.NotAPart` — a compound access that names no real part.
	if (tag.part && !component.parts.includes(tag.part)) return undefined;

	const start = tagName.getStart(sourceFile);
	return {
		component,
		part: tag.part,
		span: { start, length: tagName.getEnd() - start },
	};
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
