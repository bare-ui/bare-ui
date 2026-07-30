export type Framework = "react" | "vue" | "solid";

export type ComponentCategory =
	| "form"
	| "overlay"
	| "display"
	| "layout"
	| "navigation"
	| "feedback";

export type HookCategory =
	| "state"
	| "interaction"
	| "observer"
	| "positioning"
	| "timing"
	| "dom";

export interface PropInfo {
	name: string;
	type: string;
	required: boolean;
	description: string;
	defaultValue?: string;
}

export interface DataAttributeInfo {
	name: string;
	description: string;
	values?: string;
	appliesTo?: string;
}

export interface FrameworkSnippets {
	importStatement: string;
	basicExample: string;
}

export interface ComponentData {
	name: string;
	category: ComponentCategory;
	description: string;
	isCompound: boolean;
	parts: string[];
	/**
	 * Parts that render no DOM element of their own — context providers, portals,
	 * and render-prop passthroughs. They accept no styling props: a `className` /
	 * `class` written on them has nowhere to land and is silently dropped.
	 * Omitted when every part renders markup.
	 */
	contextOnlyParts?: string[];
	props: Record<string, PropInfo[]>;
	dataAttributes: DataAttributeInfo[];
	frameworks: Partial<Record<Framework, FrameworkSnippets>>;
	notes?: string[];
}

export interface HookFrameworkSnippet {
	name: string;
	importStatement: string;
	basicExample: string;
}

export interface HookData {
	canonicalName: string;
	category: HookCategory;
	description: string;
	signature?: string;
	returns?: string;
	/**
	 * Docs page slug under `/docs/hooks`. Omit when it is the conventional
	 * `use-<canonicalName>`; set it when the hook is documented on a sibling's
	 * page, or `null` when it has no page yet.
	 */
	docsSlug?: string | null;
	frameworks: Partial<Record<Framework, HookFrameworkSnippet>>;
	notes?: string[];
}

/**
 * One framework's realization of a scaffold: a complete, ready-to-style file —
 * imports, state, transport stub, and markup — not a fragment.
 */
export interface ScaffoldSnippet {
	source: string;
}

/**
 * A composed starting point that wires several primitives together, in contrast
 * to `ComponentData.frameworks[fw].basicExample`, which shows one component in
 * isolation. Scaffolds are what an "AI primitive" looks like end to end.
 */
export interface ScaffoldData {
	/** Kebab-case identifier, e.g. `chat`. */
	name: string;
	/** Short human title, e.g. `Streaming chat`. */
	title: string;
	description: string;
	/** Wire UI components the scaffold composes. */
	components: string[];
	/** Wire UI hooks the scaffold uses, by canonical name. */
	hooks: string[];
	frameworks: Partial<Record<Framework, ScaffoldSnippet>>;
	notes?: string[];
}

export interface DecisionEntry {
	condition: string;
	component: string;
}

export interface DecisionTree {
	name: string;
	question: string;
	entries: DecisionEntry[];
}
