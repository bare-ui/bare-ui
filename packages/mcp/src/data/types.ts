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
	frameworks: Partial<Record<Framework, HookFrameworkSnippet>>;
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
