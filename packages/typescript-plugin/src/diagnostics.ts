import type * as ts from "typescript";
import { resolveTag } from "./ast.js";
import {
	getComponentMetadata,
	type ComponentMetadata,
} from "./metadata/index.js";
import { wireImportBindings, type TsModule } from "./scan.js";

/** `source` field stamped on every diagnostic this plugin emits. */
export const WIRE_DIAGNOSTIC_SOURCE = "wire-ui";

/**
 * Diagnostic codes are namespaced in the `9xxxx` range to avoid colliding with
 * tsserver's own codes. Each rule owns one code.
 */
export const WIRE_RULES = {
	missingRootWrapper: { name: "missing-root-wrapper", code: 90001 },
	compoundPartOutsideRoot: {
		name: "compound-part-outside-root",
		code: 90002,
	},
} as const;

/** A JSX tag that carries attributes — `<X …>` or `<X … />`. */
type JsxOpeningLike = ts.JsxOpeningElement | ts.JsxSelfClosingElement;

/** A Wire UI compound part written in the source, with its opening-like tag. */
interface PartUsage {
	component: ComponentMetadata;
	/** Local tag base (an alias when imported `as`), for actionable messages. */
	localName: string;
	part: string;
	element: JsxOpeningLike;
}

/**
 * Resolve an opening-like JSX tag to the Wire UI component it renders, its local
 * base name, and the compound part (if the tag is `X.Part`). Import-gated and
 * alias-aware via the precomputed `bindings`; returns `undefined` for non-Wire
 * or unimported tags.
 */
function resolveElement(
	tsLib: TsModule,
	bindings: Map<string, string>,
	element: JsxOpeningLike,
):
	| { component: ComponentMetadata; localName: string; part?: string }
	| undefined {
	const tag = resolveTag(tsLib, element.tagName);
	if (!tag) return undefined;

	const componentName = bindings.get(tag.name);
	if (!componentName) return undefined;

	const component = getComponentMetadata(componentName);
	if (!component) return undefined;

	return { component, localName: tag.name, part: tag.part };
}

/** Whether a resolved tag is the component's root — bare `<X>` or `<X.Root>`. */
function isRootTag(part: string | undefined): boolean {
	return part === undefined || part === "Root";
}

/** Visit every opening-like JSX tag in the file. */
function forEachOpeningLike(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	visit: (element: JsxOpeningLike) => void,
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
 * Whether the part `element` has an ancestor that is its component's root — a
 * bare `<X>` or `<X.Root>` wrapping it. The part's own element never counts
 * (it resolves to the part, not the root), so nesting through intermediate
 * markup (`<X.Root><div><X.Part/></div></X.Root>`) still resolves correctly.
 */
function hasRootAncestor(
	tsLib: TsModule,
	bindings: Map<string, string>,
	element: JsxOpeningLike,
	componentName: string,
): boolean {
	for (
		let node: ts.Node | undefined = element.parent;
		node;
		node = node.parent
	) {
		if (!tsLib.isJsxElement(node)) continue;
		const resolved = resolveElement(tsLib, bindings, node.openingElement);
		if (
			resolved &&
			resolved.component.name === componentName &&
			isRootTag(resolved.part)
		) {
			return true;
		}
	}
	return false;
}

/**
 * Compute Wire UI's semantic diagnostics for a source file. Both rules key off
 * the one invariant the catalog encodes: a compound component's non-`Root` part
 * only reaches its shared context when nested inside that component's root
 * (`<X.Root>` or the bare `<X>`). A part without such a root ancestor is
 * flagged — as `compound-part-outside-root` when a root for that component
 * exists elsewhere in the file (the part escaped it), or `missing-root-wrapper`
 * when no root is present at all.
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

	const usages: PartUsage[] = [];
	// Component names (canonical) that have a root element somewhere in the file.
	const rootsPresent = new Set<string>();

	forEachOpeningLike(tsLib, sourceFile, (element) => {
		const resolved = resolveElement(tsLib, bindings, element);
		if (!resolved) return;

		if (isRootTag(resolved.part)) {
			rootsPresent.add(resolved.component.name);
			return;
		}

		const { component, part } = resolved;
		// Only real, non-Root parts of a compound component qualify.
		if (
			!component.isCompound ||
			part === undefined ||
			!component.parts.includes(part)
		) {
			return;
		}

		usages.push({
			component,
			localName: resolved.localName,
			part,
			element,
		});
	});

	const diagnostics: ts.Diagnostic[] = [];

	for (const usage of usages) {
		if (
			hasRootAncestor(
				tsLib,
				bindings,
				usage.element,
				usage.component.name,
			)
		) {
			continue;
		}

		const outside = rootsPresent.has(usage.component.name);
		const rule = outside
			? WIRE_RULES.compoundPartOutsideRoot
			: WIRE_RULES.missingRootWrapper;

		const { localName, part, component } = usage;
		const messageText = outside
			? `<${localName}.${part}> renders outside its ${component.name} root, so it can't reach the shared context. Nest it inside <${localName}.Root>.`
			: `<${localName}.${part}> has no ${component.name} root wrapper, so it can't reach the shared context. Wrap it in <${localName}.Root>.`;

		const tagName = usage.element.tagName;
		const start = tagName.getStart(sourceFile);

		diagnostics.push({
			file: sourceFile,
			start,
			length: tagName.getEnd() - start,
			messageText,
			category: tsLib.DiagnosticCategory.Error,
			code: rule.code,
			source: WIRE_DIAGNOSTIC_SOURCE,
		});
	}

	return diagnostics;
}
