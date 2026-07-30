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
	hooks,
	scaffolds,
	type ComponentData,
	type Framework,
	type HookData,
	type ScaffoldData,
} from "@wire-ui/mcp/data";
import type {
	ComponentMetadata,
	DataAttributeMetadata,
	HookFrameworkMetadata,
	HookMetadata,
	ScaffoldMetadata,
} from "./types.js";

export type {
	ComponentMetadata,
	DataAttributeMetadata,
	ComponentCategory,
	Framework,
	FrameworkSnippets,
	HookCategory,
	HookFrameworkMetadata,
	HookMetadata,
	PropInfo,
	ScaffoldMetadata,
} from "./types.js";

const DOCS_BASE = "https://wire-ui.com/docs/components";
const HOOKS_DOCS_BASE = "https://wire-ui.com/docs/hooks";

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

// ---------------------------------------------------------------------------
// Hooks / composables / primitives
// ---------------------------------------------------------------------------

/**
 * Split an import statement's named clause into the identifiers it binds.
 * A few hooks ship helpers alongside the reactive form
 * (`import { useDirection, getDirection, isRtl } from '@wire-ui/react'`), and a
 * consumer writing the import needs all of them, not just the hook.
 */
function parseImportedNames(statement: string): string[] {
	const clause = /\{([^}]*)\}/.exec(statement);
	if (!clause) return [];
	return clause[1]
		.split(",")
		.map((name) => name.trim())
		.filter(Boolean);
}

function toHookFramework(
	snippet: NonNullable<HookData["frameworks"][Framework]>,
): HookFrameworkMetadata {
	return {
		name: snippet.name,
		importStatement: snippet.importStatement,
		basicExample: snippet.basicExample,
		importedNames: parseImportedNames(snippet.importStatement),
	};
}

/**
 * The docs page a hook is documented on. Most follow `use-<canonicalName>`;
 * the catalog overrides that for hooks documented on a sibling's page, and says
 * `null` for the ones with no page yet — those get no URL rather than a 404.
 */
function hookDocsUrl(hook: HookData): string | undefined {
	if (hook.docsSlug === null) return undefined;
	return `${HOOKS_DOCS_BASE}/${hook.docsSlug ?? `use-${hook.canonicalName}`}`;
}

function toHookMetadata(hook: HookData): HookMetadata {
	const examples: HookMetadata["examples"] = {};
	for (const framework of FRAMEWORKS) {
		const snippet = hook.frameworks[framework];
		if (snippet) examples[framework] = toHookFramework(snippet);
	}

	return {
		canonicalName: hook.canonicalName,
		category: hook.category,
		description: hook.description,
		signature: hook.signature,
		returns: hook.returns,
		frameworks: FRAMEWORKS.filter((fw) => hook.frameworks[fw]),
		examples,
		docsUrl: hookDocsUrl(hook),
		notes: hook.notes ?? [],
	};
}

// Keyed by canonical name *and* by every framework export name, so
// `useHotkeys`, `createHotkeys`, and `hotkeys` all resolve to one entry.
let hookCache: Map<string, HookMetadata> | null = null;

function getHookCache(): Map<string, HookMetadata> {
	if (hookCache) return hookCache;
	const map = new Map<string, HookMetadata>();
	for (const hook of hooks) {
		const meta = toHookMetadata(hook);
		map.set(hook.canonicalName.toLowerCase(), meta);
		for (const framework of meta.frameworks)
			map.set(meta.examples[framework]!.name.toLowerCase(), meta);
	}
	hookCache = map;
	return map;
}

/**
 * Get editor metadata for a single hook. Accepts the canonical name or any
 * framework's export name, case-insensitively.
 *
 * @example
 * getHookMetadata('useHotkeys')?.canonicalName // "hotkeys"
 * getHookMetadata('createHotkeys')?.canonicalName // "hotkeys"
 */
export function getHookMetadata(name: string): HookMetadata | undefined {
	return getHookCache().get(name.toLowerCase());
}

/** All hook metadata, in catalog order. */
export function getAllHookMetadata(): HookMetadata[] {
	const cached = getHookCache();
	return hooks.map((hook) => cached.get(hook.canonicalName.toLowerCase())!);
}

/** Canonical hook names, in catalog order. */
export function listHookNames(): string[] {
	return hooks.map((hook) => hook.canonicalName);
}

/** Whether a name (canonical or per-framework export) is a known Wire UI hook. */
export function isWireHook(name: string): boolean {
	return getHookCache().has(name.toLowerCase());
}

// ---------------------------------------------------------------------------
// Scaffolds
// ---------------------------------------------------------------------------

function toScaffoldMetadata(scaffold: ScaffoldData): ScaffoldMetadata {
	const sources: ScaffoldMetadata["sources"] = {};
	for (const framework of FRAMEWORKS) {
		const snippet = scaffold.frameworks[framework];
		if (snippet) sources[framework] = snippet.source;
	}

	return {
		name: scaffold.name,
		title: scaffold.title,
		description: scaffold.description,
		components: scaffold.components,
		hooks: scaffold.hooks,
		frameworks: FRAMEWORKS.filter((fw) => scaffold.frameworks[fw]),
		sources,
		notes: scaffold.notes ?? [],
	};
}

let scaffoldCache: Map<string, ScaffoldMetadata> | null = null;

function getScaffoldCache(): Map<string, ScaffoldMetadata> {
	if (scaffoldCache) return scaffoldCache;
	const map = new Map<string, ScaffoldMetadata>();
	for (const scaffold of scaffolds)
		map.set(scaffold.name.toLowerCase(), toScaffoldMetadata(scaffold));
	scaffoldCache = map;
	return map;
}

/** Get metadata for a single scaffold by name (case-insensitive). */
export function getScaffoldMetadata(
	name: string,
): ScaffoldMetadata | undefined {
	return getScaffoldCache().get(name.toLowerCase());
}

/** All scaffold metadata, in catalog order. */
export function getAllScaffoldMetadata(): ScaffoldMetadata[] {
	return [...getScaffoldCache().values()];
}

/** Reset the caches. Intended for tests only. */
export function __resetMetadataCache(): void {
	cache = null;
	hookCache = null;
	scaffoldCache = null;
}
