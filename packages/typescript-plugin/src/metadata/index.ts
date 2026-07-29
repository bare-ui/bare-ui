// Metadata layer — a thin, cached adapter over the @wire-ui/mcp catalog.
//
// @wire-ui/mcp is the single source of truth for component data. This module
// reads that data once, reshapes it into the editor-facing `ComponentMetadata`
// shape, and caches the result. Nothing here re-states component facts; it only
// transforms what the catalog already knows (parsing value unions, deriving the
// canonical docs URL, narrowing the framework map to a list — while still
// exposing that map's snippets verbatim as `examples`).

import {
	components,
	type ComponentData,
	type Framework,
} from "@wire-ui/mcp/data";
import type { ComponentMetadata, DataAttributeMetadata } from "./types.js";

export type {
	ComponentMetadata,
	DataAttributeMetadata,
	ComponentCategory,
	Framework,
	FrameworkSnippets,
	PropInfo,
} from "./types.js";

const DOCS_BASE = "https://wire-ui.com/docs/components";

/** All frameworks Wire UI targets, in catalog order. */
export const FRAMEWORKS: readonly Framework[] = ["react", "vue", "solid"];

/**
 * Convert a component name to its kebab-case slug — the docs URL segment, and
 * the stem editor tooling builds snippet prefixes from (`wire-number-input`).
 *   Accordion   -> accordion
 *   NumberInput -> number-input
 *   MenuBar     -> menu-bar
 *   OTP         -> otp
 */
export function toComponentSlug(name: string): string {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();
}

/**
 * Parse a catalog value union (`'"open" | "closed"'`) into a value array
 * (`["open", "closed"]`). Returns `[]` for boolean presence attributes that
 * carry no value union.
 */
function parseValues(raw: string | undefined): string[] {
	if (!raw) return [];
	const matches = raw.match(/"([^"]*)"/g);
	if (matches) return matches.map((m) => m.slice(1, -1));
	// Fall back to splitting a bare `a | b | c` union with no quotes.
	return raw
		.split("|")
		.map((s) => s.trim())
		.filter(Boolean);
}

function toDataAttribute(
	attr: ComponentData["dataAttributes"][number],
): DataAttributeMetadata {
	return {
		name: attr.name,
		description: attr.description,
		values: parseValues(attr.values),
		rawValues: attr.values,
		appliesTo: attr.appliesTo,
	};
}

function toMetadata(component: ComponentData): ComponentMetadata {
	const dataAttributes = component.dataAttributes.map(toDataAttribute);
	const dataState = dataAttributes.find((a) => a.name === "data-state");

	return {
		name: component.name,
		category: component.category,
		description: component.description,
		isCompound: component.isCompound,
		parts: component.parts,
		contextOnlyParts: component.contextOnlyParts ?? [],
		dataAttributes,
		dataStateValues: dataState?.values ?? [],
		props: component.props,
		frameworks: FRAMEWORKS.filter((fw) => component.frameworks[fw]),
		examples: component.frameworks,
		docsUrl: `${DOCS_BASE}/${toComponentSlug(component.name)}`,
		notes: component.notes ?? [],
	};
}

// Built lazily and memoized — the catalog is static for the process lifetime.
let cache: Map<string, ComponentMetadata> | null = null;

function getCache(): Map<string, ComponentMetadata> {
	if (cache) return cache;
	const map = new Map<string, ComponentMetadata>();
	for (const component of components) {
		map.set(component.name.toLowerCase(), toMetadata(component));
	}
	cache = map;
	return map;
}

/**
 * Get editor metadata for a single component by name (case-insensitive).
 * Returns `undefined` for unknown components.
 *
 * @example
 * getComponentMetadata('Accordion')?.parts // ["Root", "Item", "Trigger", "Content"]
 * getComponentMetadata('Accordion')?.dataStateValues // ["open", "closed"]
 */
export function getComponentMetadata(
	name: string,
): ComponentMetadata | undefined {
	return getCache().get(name.toLowerCase());
}

/** All component metadata, in catalog order. */
export function getAllComponentMetadata(): ComponentMetadata[] {
	return [...getCache().values()];
}

/** Canonical component names, in catalog order. */
export function listComponentNames(): string[] {
	return getAllComponentMetadata().map((c) => c.name);
}

/** Whether a name (case-insensitive) is a known Wire UI component. */
export function isWireComponent(name: string): boolean {
	return getCache().has(name.toLowerCase());
}

/** Reset the cache. Intended for tests only. */
export function __resetMetadataCache(): void {
	cache = null;
}
