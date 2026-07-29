import {
	ESLintUtils,
	type TSESLint,
	type TSESTree,
} from "@typescript-eslint/utils";
import {
	getAllComponentMetadata,
	getComponentMetadata,
	isWireComponent,
	type ComponentMetadata,
	type PropInfo,
} from "@wire-ui/typescript-plugin/metadata";

/** Factory for our rules, wiring each to its docs page. */
export const createRule = ESLintUtils.RuleCreator(
	(name) => `https://wire-ui.com/docs/eslint/${name}`,
);

/**
 * True for module specifiers that resolve to a Wire UI framework package —
 * `@wire-ui/react`, `@wire-ui/vue`, `@wire-ui/solid`, or a bare `wire-ui`.
 * Mirrors the TypeScript plugin's `isWireUiModuleSpecifier` so both surfaces
 * gate on imports identically.
 */
export function isWireUiModuleSpecifier(specifier: string): boolean {
	return /(^|\/)@?wire-ui(\/|$)/.test(specifier);
}

/**
 * Map the local names bound to Wire UI components in a file to their canonical
 * component name. Alias-aware: `import { Switch as Toggle } from '@wire-ui/react'`
 * yields `Toggle -> Switch`, so `<Toggle.Thumb>` resolves to `Switch`'s parts.
 * Only named imports from a `@wire-ui/*` package that name a known component are
 * included, so a same-named component from another library is never matched.
 */
export function wireImportBindings(
	program: TSESTree.Program,
): Map<string, string> {
	const bindingsByLocal = new Map<string, string>();

	for (const statement of program.body) {
		if (statement.type !== "ImportDeclaration") continue;
		if (typeof statement.source.value !== "string") continue;
		if (!isWireUiModuleSpecifier(statement.source.value)) continue;

		for (const specifier of statement.specifiers) {
			if (specifier.type !== "ImportSpecifier") continue;
			// `imported` is a string literal only for `import { "x" as y }`; the
			// name we check against the catalog is the imported (not local) name.
			const importedName =
				specifier.imported.type === "Identifier"
					? specifier.imported.name
					: specifier.imported.value;
			if (isWireComponent(importedName)) {
				bindingsByLocal.set(specifier.local.name, importedName);
			}
		}
	}

	return bindingsByLocal;
}

/**
 * Split a JSX tag name into its base local name and compound part, if any.
 * `<Accordion>` -> `{ name: "Accordion" }`, `<Accordion.Item>` ->
 * `{ name: "Accordion", part: "Item" }`. Returns `undefined` for anything more
 * exotic (namespaced tags, nested member access like `X.Y.Z`).
 */
export function resolveJsxTagName(
	name: TSESTree.JSXTagNameExpression,
): { name: string; part?: string } | undefined {
	if (name.type === "JSXIdentifier") return { name: name.name };
	if (
		name.type === "JSXMemberExpression" &&
		name.object.type === "JSXIdentifier" &&
		name.property.type === "JSXIdentifier"
	) {
		return { name: name.object.name, part: name.property.name };
	}
	return undefined;
}

/** A JSX opening tag resolved to the Wire UI component it renders. */
export interface ResolvedElement {
	component: ComponentMetadata;
	/** Local tag base (an alias when imported `as`), for actionable messages. */
	localName: string;
	/** The compound part being written (`Accordion.Item` -> `Item`), if any. */
	part?: string;
	/**
	 * The catalog key that governs this tag. Compound components key props by
	 * part, so a bare `<X>` reads as `Root`; single-element components (`Button`)
	 * and hybrids (`Toggle`) key theirs by the component's own name.
	 */
	effectivePart: string;
}

/**
 * Resolve an opening JSX tag to the Wire UI component it renders, its local base
 * name, and the compound part. Import-gated and alias-aware via `bindings`;
 * returns `undefined` for non-Wire or unimported tags.
 */
export function resolveElement(
	openingElement: TSESTree.JSXOpeningElement,
	bindings: Map<string, string>,
): ResolvedElement | undefined {
	const tag = resolveJsxTagName(openingElement.name);
	if (!tag) return undefined;

	const componentName = bindings.get(tag.name);
	if (!componentName) return undefined;

	const component = getComponentMetadata(componentName);
	if (!component) return undefined;

	return {
		component,
		localName: tag.name,
		part: tag.part,
		effectivePart:
			tag.part ??
			(component.parts.includes("Root") ? "Root" : component.name),
	};
}

/** The tag as it reads in the source — `Modal` or `Modal.Root`. */
export function tagText(resolved: ResolvedElement): string {
	return resolved.part
		? `${resolved.localName}.${resolved.part}`
		: resolved.localName;
}

/** Catalog props governing a tag, keyed by the part `resolveElement` chose. */
export function propsForPart(resolved: ResolvedElement): PropInfo[] {
	return resolved.component.props[resolved.effectivePart] ?? [];
}

/** Whether the catalog declares `propName` on the part governing this tag. */
export function partDeclaresProp(
	resolved: ResolvedElement,
	propName: string,
): boolean {
	return propsForPart(resolved).some((prop) => prop.name === propName);
}

/** Parts that render markup — everything the catalog doesn't call context-only. */
export function renderingParts(component: ComponentMetadata): string[] {
	return component.parts.filter(
		(part) => !component.contextOnlyParts.includes(part),
	);
}

/** The named attribute written on a tag, if any. Spreads are not attributes. */
export function findAttribute(
	openingElement: TSESTree.JSXOpeningElement,
	name: string,
): TSESTree.JSXAttribute | undefined {
	return openingElement.attributes.find(
		(attribute): attribute is TSESTree.JSXAttribute =>
			attribute.type === "JSXAttribute" &&
			attribute.name.type === "JSXIdentifier" &&
			attribute.name.name === name,
	);
}

/** Whether the tag carries a `{...spread}`, which hides what it may contain. */
export function hasSpreadAttribute(
	openingElement: TSESTree.JSXOpeningElement,
): boolean {
	return openingElement.attributes.some(
		(attribute) => attribute.type === "JSXSpreadAttribute",
	);
}

// Every `data-state` value any component in the catalog emits, so a rule only
// ever suggests a value Wire UI actually produces.
let dataStateVocabulary: Set<string> | null = null;

export function knownDataStateValues(): Set<string> {
	if (dataStateVocabulary) return dataStateVocabulary;
	const values = new Set<string>();
	for (const component of getAllComponentMetadata()) {
		for (const value of component.dataStateValues) values.add(value);
	}
	dataStateVocabulary = values;
	return values;
}

/** Whether a resolved tag is the component's root — bare `<X>` or `<X.Root>`. */
export function isRootPart(part: string | undefined): boolean {
	return part === undefined || part === "Root";
}

/**
 * Whether the tag has an ancestor that is its component's root — a bare `<X>` or
 * `<X.Root>` wrapping it. The part's own element never counts (it resolves to
 * the part, not the root), so nesting through intermediate markup
 * (`<X.Root><div><X.Part/></div></X.Root>`) still resolves correctly.
 */
export function hasRootAncestor(
	openingElement: TSESTree.JSXOpeningElement,
	componentName: string,
	bindings: Map<string, string>,
): boolean {
	for (
		let node: TSESTree.Node | undefined = openingElement.parent;
		node;
		node = node.parent
	) {
		if (node.type !== "JSXElement") continue;
		const resolved = resolveElement(node.openingElement, bindings);
		if (
			resolved &&
			resolved.component.name === componentName &&
			isRootPart(resolved.part)
		) {
			return true;
		}
	}
	return false;
}

/** A compound part written in the source that we track for the two rules. */
export interface CompoundUsage {
	openingElement: TSESTree.JSXOpeningElement;
	localName: string;
	part: string;
	component: ComponentMetadata;
}

/**
 * Build the visitor both rules share: it walks a file's JSX once, records every
 * real non-`Root` compound part and which components have a root present, then
 * on `Program:exit` reports each part that lacks a root ancestor — but only when
 * its situation matches `mode`. A part with a root elsewhere in the file escaped
 * it (`outside`); a part with no root at all is missing its wrapper (`missing`).
 * The two conditions are mutually exclusive, so the two rules never double-report.
 *
 * JSX-only (React/Solid TSX, Vue-via-JSX). Import-gated and alias-aware, so
 * unrelated same-named tags and non-Wire markup produce nothing.
 */
export function createCompoundVisitor<MessageId extends string>(
	context: Readonly<TSESLint.RuleContext<MessageId, []>>,
	mode: "outside" | "missing",
	messageId: MessageId,
): TSESLint.RuleListener {
	const bindings = wireImportBindings(context.sourceCode.ast);
	if (bindings.size === 0) return {};

	const usages: CompoundUsage[] = [];
	// Canonical component names that have a root element somewhere in the file.
	const rootsPresent = new Set<string>();

	return {
		JSXOpeningElement(node) {
			const resolved = resolveElement(node, bindings);
			if (!resolved) return;

			if (isRootPart(resolved.part)) {
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
				openingElement: node,
				localName: resolved.localName,
				part,
				component,
			});
		},
		"Program:exit"() {
			for (const usage of usages) {
				if (
					hasRootAncestor(
						usage.openingElement,
						usage.component.name,
						bindings,
					)
				) {
					continue;
				}

				const usageMode = rootsPresent.has(usage.component.name)
					? "outside"
					: "missing";
				if (usageMode !== mode) continue;

				context.report({
					node: usage.openingElement.name,
					messageId,
					data: {
						tag: usage.localName,
						part: usage.part,
						component: usage.component.name,
					},
				});
			}
		},
	};
}
