import React from 'react';

/** Node descriptor — the consumer's data; passed through to renderers. */
export interface TreeNode<T = unknown> {
	id: string;
	label?: React.ReactNode;
	children?: TreeNode<T>[];
	disabled?: boolean;
	data?: T;
}

export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export interface TreeViewRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
	/** Render-prop: receives a node + its render-state for each visible row. */
	renderItem: (node: TreeNode, state: TreeItemState) => React.ReactNode;
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
	expanded: Set<string>;
	selected: Set<string>;
	selectionMode: TreeSelectionMode;
	toggleExpanded: (id: string) => void;
	selectNode: (id: string) => void;
}
