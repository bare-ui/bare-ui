export type Framework = "react" | "vue" | "solid";

export type ComponentCategory =
	| "form"
	| "overlay"
	| "display"
	| "layout"
	| "feedback";

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
	props: Record<string, PropInfo[]>;
	dataAttributes: DataAttributeInfo[];
	frameworks: Partial<Record<Framework, FrameworkSnippets>>;
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
