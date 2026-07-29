// AST and catalog helpers shared by the diagnostic rules.

import type * as ts from "typescript";
import { resolveTag, type JsxOpeningLikeElement } from "../ast.js";
import {
	getAllComponentMetadata,
	getComponentMetadata,
	type ComponentMetadata,
	type DataAttributeMetadata,
	type PropInfo,
} from "../metadata/index.js";
import type { TsModule } from "../scan.js";
import type { WireElement } from "./types.js";

/**
 * Resolve an opening-like JSX tag to the Wire UI component it renders, its
 * local base name, and the compound part. Import-gated and alias-aware via the
 * precomputed `bindings`; returns `undefined` for non-Wire or unimported tags.
 */
export function resolveWireElement(
	tsLib: TsModule,
	bindings: Map<string, string>,
	element: JsxOpeningLikeElement,
): WireElement | undefined {
	const tag = resolveTag(tsLib, element.tagName);
	if (!tag) return undefined;

	const componentName = bindings.get(tag.name);
	if (!componentName) return undefined;

	const component = getComponentMetadata(componentName);
	if (!component) return undefined;

	return {
		element,
		component,
		localName: tag.name,
		part: tag.part,
		effectivePart: effectivePartFor(component, tag.part),
	};
}

/**
 * The catalog key that governs a tag. Compound components key their props and
 * `appliesTo` scopes by part, so a bare `<X>` reads as `Root`. Single-element
 * components (`Button`) and the few hybrids (`Toggle`, which pairs a standalone
 * part with a `ToggleGroup.*` set) key theirs by the component's own name.
 */
function effectivePartFor(
	component: ComponentMetadata,
	part: string | undefined,
): string {
	if (part !== undefined) return part;
	if (component.parts.includes("Root")) return "Root";
	return component.name;
}

/** Whether a tag is its component's root — a bare `<X>` or an explicit `<X.Root>`. */
export function isRootTag(part: string | undefined): boolean {
	return part === undefined || part === "Root";
}

/** The tag as it reads in the source — `Modal` or `Modal.Root`. */
export function tagText(usage: WireElement): string {
	return usage.part ? `${usage.localName}.${usage.part}` : usage.localName;
}

/** Every JSX attribute written on a tag, skipping `{...spread}` entries. */
export function attributesOf(
	tsLib: TsModule,
	element: JsxOpeningLikeElement,
): ts.JsxAttribute[] {
	return element.attributes.properties.filter(
		(property): property is ts.JsxAttribute =>
			tsLib.isJsxAttribute(property),
	);
}

/** Whether the tag carries a `{...spread}`, which hides what it may contain. */
export function hasSpreadAttribute(
	tsLib: TsModule,
	element: JsxOpeningLikeElement,
): boolean {
	return element.attributes.properties.some((property) =>
		tsLib.isJsxSpreadAttribute(property),
	);
}

/** The named attribute written on a tag, if any. */
export function findAttribute(
	tsLib: TsModule,
	element: JsxOpeningLikeElement,
	name: string,
): ts.JsxAttribute | undefined {
	return attributesOf(tsLib, element).find(
		(attribute) =>
			tsLib.isIdentifier(attribute.name) && attribute.name.text === name,
	);
}

/**
 * The static string an attribute was given — `x="a"` and `x={'a'}` both yield
 * `a`. Returns `undefined` when the value is dynamic (or the attribute is a
 * bare presence flag), which every rule treats as "can't tell, don't report".
 */
export function attributeStringValue(
	tsLib: TsModule,
	attribute: ts.JsxAttribute,
): string | undefined {
	const initializer = attribute.initializer;
	if (!initializer) return undefined;
	if (tsLib.isStringLiteral(initializer)) return initializer.text;
	if (
		tsLib.isJsxExpression(initializer) &&
		initializer.expression &&
		tsLib.isStringLiteralLike(initializer.expression)
	) {
		return initializer.expression.text;
	}
	return undefined;
}

/** Catalog props governing a tag, keyed by the part `resolveWireElement` chose. */
export function propsForPart(
	component: ComponentMetadata,
	effectivePart: string,
): PropInfo[] {
	return component.props[effectivePart] ?? [];
}

/** Whether the catalog declares `propName` on the part governing this tag. */
export function partDeclaresProp(
	component: ComponentMetadata,
	effectivePart: string,
	propName: string,
): boolean {
	return propsForPart(component, effectivePart).some(
		(prop) => prop.name === propName,
	);
}

/**
 * The parts an attribute's `appliesTo` names, as real catalog parts. The field
 * is a comma-separated part list for most attributes but free prose for a few
 * (`"Items row"`, `"Markdown (code block)"`), so anything that doesn't resolve
 * to a declared part is dropped — an empty result means "unscoped, don't infer".
 */
export function appliesToParts(
	component: ComponentMetadata,
	attribute: DataAttributeMetadata,
): string[] {
	if (!attribute.appliesTo) return [];
	return attribute.appliesTo
		.split(",")
		.map((entry) => entry.trim())
		.filter((entry) => component.parts.includes(entry));
}

/** Parts that render markup — everything the catalog doesn't call context-only. */
export function renderingParts(component: ComponentMetadata): string[] {
	return component.parts.filter(
		(part) => !component.contextOnlyParts.includes(part),
	);
}

// Every `data-state` value any component in the catalog emits. Rules that map
// an authoring mistake onto a `data-state` value check it against this set, so
// a suggestion is only ever made for a value Wire UI actually produces.
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

// Every `data-*` name the catalog documents as a presence flag — no value
// union, so it is `''` when on and absent when off, never `"false"`.
let presenceAttributes: Set<string> | null = null;

export function knownPresenceAttributes(): Set<string> {
	if (presenceAttributes) return presenceAttributes;
	const names = new Set<string>();
	const valued = new Set<string>();
	for (const component of getAllComponentMetadata()) {
		for (const attribute of component.dataAttributes) {
			(attribute.values.length > 0 ? valued : names).add(attribute.name);
		}
	}
	// An attribute that carries values on any component isn't presence-based.
	for (const name of valued) names.delete(name);
	presenceAttributes = names;
	return names;
}

/** Reset the derived catalog lookups. Intended for tests only. */
export function __resetRuleCaches(): void {
	dataStateVocabulary = null;
	presenceAttributes = null;
}
