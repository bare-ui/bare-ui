import type { Component, JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Nodes — a normalized, mdast-compatible tree
// ---------------------------------------------------------------------------

/**
 * Well-known node types. Any other string is allowed too — unknown types fall
 * back to rendering their children, so custom parser output never breaks.
 */
export type MarkdownNodeType =
	| 'root'
	| 'paragraph'
	| 'heading'
	| 'text'
	| 'strong'
	| 'emphasis'
	| 'delete'
	| 'inlineCode'
	| 'code'
	| 'link'
	| 'image'
	| 'list'
	| 'listItem'
	| 'blockquote'
	| 'thematicBreak'
	| 'break'
	| (string & {});

/**
 * A normalized Markdown node. Field names mirror `mdast` (remark's AST), so
 * remark output can be passed through unchanged; other parsers (e.g. `marked`)
 * can be mapped onto this shape.
 */
export interface MarkdownNode {
	type: MarkdownNodeType;
	/** Literal text for leaf nodes (`text`, `inlineCode`, `code`, `html`). */
	value?: string;
	/** Heading level, 1–6. */
	depth?: number;
	/** Destination for `link` / `image`. */
	url?: string;
	/** Advisory title for `link` / `image`. */
	title?: string | null;
	/** Alternate text for `image`. */
	alt?: string;
	/** Whether a `list` is ordered. */
	ordered?: boolean;
	/** Starting number for an ordered `list`. */
	start?: number;
	/** Task-list state for a `listItem` (`null` when not a checkbox item). */
	checked?: boolean | null;
	/** Language hint for a fenced `code` block. */
	lang?: string;
	/** Child nodes. */
	children?: MarkdownNode[];
}

// ---------------------------------------------------------------------------
// Render parts
// ---------------------------------------------------------------------------

export interface MarkdownComponentProps {
	/** The node being rendered. */
	node: MarkdownNode;
	/** Pre-rendered child nodes (or the leaf `value`). */
	children?: JSX.Element;
}

export type MarkdownComponent = Component<MarkdownComponentProps>;

/** Map of node type → renderer. Overrides merge over the built-in renderers. */
export type MarkdownComponents = Partial<Record<string, MarkdownComponent>>;

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface MarkdownProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Pre-parsed node tree. Provide this, or `content` + `parse`. */
	nodes?: MarkdownNode[];
	/** Raw Markdown source. Parsed with `parse` when provided. */
	content?: string;
	/** Turns `content` into normalized nodes — wrap `remark`/`marked` here. */
	parse?: (content: string) => MarkdownNode[];
	/** Override the renderer used for one or more node types. */
	components?: MarkdownComponents;
}
