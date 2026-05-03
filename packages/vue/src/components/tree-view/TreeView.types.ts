import type { ComputedRef } from 'vue'

/** Node descriptor — the consumer's data; passed through to renderers. */
export interface TreeNode<T = unknown> {
	id: string;
	label?: string;
	children?: TreeNode<T>[];
	disabled?: boolean;
	data?: T;
}

export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export interface TreeViewRootProps {
	/** Tree data. */
	nodes: TreeNode[];
	/** Controlled expanded ids. */
	expanded?: string[];
	/** Initial expanded ids (uncontrolled). */
	defaultExpanded?: string[];
	/** Called when the expanded set changes. */
	onExpandedChange?: (expanded: string[]) => void;
	/** Selection behavior. */
	selectionMode?: TreeSelectionMode;
	/** Controlled selection. */
	selected?: string[];
	/** Initial selection (uncontrolled). */
	defaultSelected?: string[];
	/** Called when selection changes. */
	onSelectionChange?: (selected: string[]) => void;
}

export interface TreeItemState {
	level: number;
	expanded: boolean;
	selected: boolean;
	hasChildren: boolean;
	disabled: boolean;
	toggle: () => void;
	select: () => void;
}

export interface TreeViewContextValue {
	expanded: ComputedRef<Set<string>>;
	selected: ComputedRef<Set<string>>;
	selectionMode: ComputedRef<TreeSelectionMode>;
	toggleExpanded: (id: string) => void;
	selectNode: (id: string) => void;
}
