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
	PropInfo,
} from '@wire-ui/mcp/data'

export type { ComponentCategory, Framework, PropInfo } from '@wire-ui/mcp/data'

/**
 * A single `data-*` attribute a component exposes, with its value enum parsed
 * out of the source's union-literal string (e.g. `'"open" | "closed"'`) into a
 * plain array the completion provider can offer directly.
 */
export interface DataAttributeMetadata {
	/** Attribute name, e.g. `data-state`, `data-hover`. */
	name: string
	/** Human-readable description for hover docs / completion detail. */
	description: string
	/**
	 * Parsed value enum. Empty when the attribute is a boolean presence flag
	 * (e.g. `data-hover`) that carries no value.
	 */
	values: string[]
	/** Raw value union as authored in the catalog, if any. */
	rawValues?: string
	/** Which compound parts the attribute appears on, if scoped. */
	appliesTo?: string
}

/**
 * Editor-facing metadata for one Wire UI component, derived from a single
 * `ComponentData` entry in @wire-ui/mcp.
 */
export interface ComponentMetadata {
	/** Canonical component name, e.g. `Accordion`. */
	name: string
	category: ComponentCategory
	description: string
	/** True when the component is used via compound parts (`Accordion.Root`). */
	isCompound: boolean
	/** Compound part names in authored order, e.g. `["Root", "Item", ...]`. */
	parts: string[]
	/** All `data-*` attributes the component exposes, with parsed value enums. */
	dataAttributes: DataAttributeMetadata[]
	/**
	 * Convenience enum for `data-state` specifically (the most common
	 * value-completion target), e.g. `["open", "closed"]`. Empty when the
	 * component has no `data-state` attribute.
	 */
	dataStateValues: string[]
	/** Props keyed by the part they belong to (`Root`, `Item`, …). */
	props: Record<string, PropInfo[]>
	/** Frameworks that actually ship this component. */
	frameworks: Framework[]
	/** Canonical documentation URL on wire-ui.com. */
	docsUrl: string
	/** Authoring notes / gotchas from the catalog. */
	notes: string[]
}

// Re-export the raw attribute type for adapters that need the source shape.
export type { DataAttributeInfo }
