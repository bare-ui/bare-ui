// The typed shape the editor tooling consumes.
//
// `ComponentMetadata` is a *view* of the @wire-ui/mcp catalog, reshaped for the
// editor features that build on top of it (data-* autocomplete, data-state value
// completion, parts completion, hover docs, go-to-definition). It deliberately
// re-uses the MCP source types rather than redefining them, so the catalog stays
// the single source of truth.

import type {
	ComponentCategory,
	DataAttributeInfo,
	Framework,
	FrameworkSnippets,
	HookCategory,
	PropInfo,
} from "@wire-ui/mcp/data";

export type {
	ComponentCategory,
	Framework,
	FrameworkSnippets,
	HookCategory,
	PropInfo,
} from "@wire-ui/mcp/data";

/**
 * A single `data-*` attribute a component exposes, with its value enum parsed
 * out of the source's union-literal string (e.g. `'"open" | "closed"'`) into a
 * plain array the completion provider can offer directly.
 */
export interface DataAttributeMetadata {
	/** Attribute name, e.g. `data-state`, `data-hover`. */
	name: string;
	/** Human-readable description for hover docs / completion detail. */
	description: string;
	/**
	 * Parsed value enum. Empty when the attribute is a boolean presence flag
	 * (e.g. `data-hover`) that carries no value.
	 */
	values: string[];
	/** Raw value union as authored in the catalog, if any. */
	rawValues?: string;
	/** Which compound parts the attribute appears on, if scoped. */
	appliesTo?: string;
}

/**
 * Editor-facing metadata for one Wire UI component, derived from a single
 * `ComponentData` entry in @wire-ui/mcp.
 */
export interface ComponentMetadata {
	/** Canonical component name, e.g. `Accordion`. */
	name: string;
	category: ComponentCategory;
	description: string;
	/** True when the component is used via compound parts (`Accordion.Root`). */
	isCompound: boolean;
	/** Compound part names in authored order, e.g. `["Root", "Item", ...]`. */
	parts: string[];
	/**
	 * Parts that render no DOM element — context providers, portals, render-prop
	 * passthroughs. Styling props written on them are silently dropped. Empty
	 * when every part renders markup.
	 */
	contextOnlyParts: string[];
	/** All `data-*` attributes the component exposes, with parsed value enums. */
	dataAttributes: DataAttributeMetadata[];
	/**
	 * Convenience enum for `data-state` specifically (the most common
	 * value-completion target), e.g. `["open", "closed"]`. Empty when the
	 * component has no `data-state` attribute.
	 */
	dataStateValues: string[];
	/** Props keyed by the part they belong to (`Root`, `Item`, …). */
	props: Record<string, PropInfo[]>;
	/** Frameworks that actually ship this component. */
	frameworks: Framework[];
	/**
	 * Per-framework import statement and canonical usage example, as authored in
	 * the catalog. The example is the component's full compound structure with
	 * sensible defaults — the source editor snippets are generated from. Keyed by
	 * framework because the structure is shared but the authoring syntax is not
	 * (Solid calls its signals, Vue uses SFC template syntax).
	 */
	examples: Partial<Record<Framework, FrameworkSnippets>>;
	/** Canonical documentation URL on wire-ui.com. */
	docsUrl: string;
	/** Authoring notes / gotchas from the catalog. */
	notes: string[];
}

/**
 * One framework's realization of a hook. `name` is the literal export
 * (`useHotkeys` in React/Vue, `createHotkeys` in Solid), and `importedNames`
 * is the import clause already broken apart, so a consumer that has to *write*
 * the import doesn't re-parse the statement.
 */
export interface HookFrameworkMetadata {
	name: string;
	importStatement: string;
	basicExample: string;
	/** Every name the import statement binds, e.g. `useDirection`, `isRtl`. */
	importedNames: string[];
}

/**
 * Editor-facing metadata for one Wire UI hook / composable / primitive, derived
 * from a single `HookData` entry in @wire-ui/mcp. The canonical name is the
 * framework-independent identity (`click-outside`); the per-framework export
 * names live in `examples`.
 */
export interface HookMetadata {
	/** Canonical kebab-case identifier, e.g. `click-outside`. */
	canonicalName: string;
	category: HookCategory;
	description: string;
	/** Call signature as authored in the catalog, if any. */
	signature?: string;
	/** What the hook returns, in prose, if the catalog says. */
	returns?: string;
	/** Frameworks that actually ship this hook. */
	frameworks: Framework[];
	/** Per-framework export name, import statement, and usage example. */
	examples: Partial<Record<Framework, HookFrameworkMetadata>>;
	/** Documentation URL, or `undefined` when the hook has no page yet. */
	docsUrl?: string;
	/** Authoring notes / gotchas from the catalog. */
	notes: string[];
}

/**
 * Editor-facing metadata for one composed scaffold. Unlike a component example,
 * a scaffold `source` is a whole file — imports included — so consumers insert
 * it as-is rather than pairing it with an import edit.
 */
export interface ScaffoldMetadata {
	/** Kebab-case identifier, e.g. `chat`. */
	name: string;
	/** Short human title, e.g. `Streaming chat`. */
	title: string;
	description: string;
	/** Wire UI components the scaffold composes. */
	components: string[];
	/** Wire UI hooks the scaffold uses, by canonical name. */
	hooks: string[];
	/** Frameworks the scaffold is authored for. */
	frameworks: Framework[];
	/** Complete, ready-to-style file per framework. */
	sources: Partial<Record<Framework, string>>;
	/** Authoring notes / gotchas from the catalog. */
	notes: string[];
}

// Re-export the raw attribute type for adapters that need the source shape.
export type { DataAttributeInfo };
