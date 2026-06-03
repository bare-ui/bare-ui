'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type {
	TreeItemState,
	TreeNode,
	TreeViewContextValue,
	TreeViewRootProps,
} from './TreeView.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TreeContext = createContext<TreeViewContextValue | null>(null);

function useTreeContext() {
	const ctx = useContext(TreeContext);
	if (!ctx) throw new globalThis.Error('TreeView compound components must be used within TreeView.Root');
	return ctx;
}

/** Flattened, display-order list of the rows a user can currently see/navigate. */
interface VisibleEntry {
	id: string;
	parentId: string | null;
	disabled: boolean;
}

function flattenVisible(nodes: TreeNode[], expanded: Set<string>, parentId: string | null = null): VisibleEntry[] {
	const out: VisibleEntry[] = [];
	for (const node of nodes) {
		out.push({ id: node.id, parentId, disabled: !!node.disabled });
		if (node.children && node.children.length > 0 && expanded.has(node.id)) {
			out.push(...flattenVisible(node.children, expanded, node.id));
		}
	}
	return out;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, TreeViewRootProps>(
	(
		{
			nodes,
			expanded: controlledExpanded,
			defaultExpanded,
			onExpandedChange,
			selectionMode = 'none',
			selected: controlledSelected,
			defaultSelected,
			onSelectionChange,
			renderItem,
			className,
			...rest
		},
		ref,
	) => {
		const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>(defaultExpanded ?? []);
		const isExpControlled = controlledExpanded !== undefined;
		const expandedArr = isExpControlled ? (controlledExpanded as string[]) : uncontrolledExpanded;
		const expanded = useMemo(() => new Set(expandedArr), [expandedArr]);

		const [uncontrolledSelected, setUncontrolledSelected] = useState<string[]>(defaultSelected ?? []);
		const isSelControlled = controlledSelected !== undefined;
		const selectedArr = isSelControlled ? (controlledSelected as string[]) : uncontrolledSelected;
		const selected = useMemo(() => new Set(selectedArr), [selectedArr]);

		const toggleExpanded = useCallback(
			(id: string) => {
				const next = new Set(expanded);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				const arr = Array.from(next);
				if (!isExpControlled) setUncontrolledExpanded(arr);
				onExpandedChange?.(arr);
			},
			[expanded, isExpControlled, onExpandedChange],
		);

		const selectNode = useCallback(
			(id: string) => {
				if (selectionMode === 'none') return;
				let next: string[];
				if (selectionMode === 'single') {
					next = selected.has(id) ? [] : [id];
				} else {
					const set = new Set(selected);
					if (set.has(id)) set.delete(id);
					else set.add(id);
					next = Array.from(set);
				}
				if (!isSelControlled) setUncontrolledSelected(next);
				onSelectionChange?.(next);
			},
			[selectionMode, selected, isSelControlled, onSelectionChange],
		);

		const rootRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(rootRef, ref);

		// Flattened display order of currently-visible rows — the basis for arrow,
		// Home/End, and parent navigation, and for the roving tabindex.
		const visible = useMemo(() => flattenVisible(nodes, expanded), [nodes, expanded]);
		const enabledVisible = useMemo(() => visible.filter((v) => !v.disabled), [visible]);

		const [activeId, setActiveId] = useState<string | null>(null);

		// Exactly one node is tabbable: the focused node if it's still visible/enabled,
		// otherwise the first enabled row, so Tab always reaches (and exits) the tree.
		const tabbableId = useMemo(() => {
			if (activeId && enabledVisible.some((v) => v.id === activeId)) return activeId;
			return enabledVisible[0]?.id ?? null;
		}, [activeId, enabledVisible]);

		const focusId = useCallback((id: string) => {
			const el = rootRef.current?.querySelector<HTMLElement>(`[role="treeitem"][data-id="${CSS.escape(id)}"]`);
			el?.focus();
		}, []);

		const focusByOffset = useCallback(
			(fromId: string, delta: number) => {
				const idx = enabledVisible.findIndex((v) => v.id === fromId);
				if (idx < 0) return;
				const target = enabledVisible[idx + delta];
				if (target) {
					setActiveId(target.id);
					focusId(target.id);
				}
			},
			[enabledVisible, focusId],
		);

		const focusEdge = useCallback(
			(edge: 'first' | 'last') => {
				const target = edge === 'first' ? enabledVisible[0] : enabledVisible[enabledVisible.length - 1];
				if (target) {
					setActiveId(target.id);
					focusId(target.id);
				}
			},
			[enabledVisible, focusId],
		);

		const focusParent = useCallback(
			(fromId: string) => {
				const entry = visible.find((v) => v.id === fromId);
				if (entry?.parentId) {
					setActiveId(entry.parentId);
					focusId(entry.parentId);
				}
			},
			[visible, focusId],
		);

		const ctx = useMemo<TreeViewContextValue>(
			() => ({
				expanded,
				selected,
				selectionMode,
				toggleExpanded,
				selectNode,
				tabbableId,
				setActiveId,
				focusByOffset,
				focusEdge,
				focusParent,
			}),
			[expanded, selected, selectionMode, toggleExpanded, selectNode, tabbableId, focusByOffset, focusEdge, focusParent],
		);

		return (
			<TreeContext.Provider value={ctx}>
				<div
					ref={mergedRef}
					role='tree'
					aria-multiselectable={selectionMode === 'multiple' ? true : undefined}
					className={className}
					{...rest}>
					{nodes.map((node) => (
						<TreeItem
							key={node.id}
							node={node}
							level={1}
							renderItem={renderItem}
						/>
					))}
				</div>
			</TreeContext.Provider>
		);
	},
);
Root.displayName = 'TreeView.Root';

// ---------------------------------------------------------------------------
// Internal recursive item
// ---------------------------------------------------------------------------

interface TreeItemProps {
	node: TreeNode;
	level: number;
	renderItem: TreeViewRootProps['renderItem'];
}

const TreeItem: React.FC<TreeItemProps> = ({ node, level, renderItem }) => {
	const { expanded, selected, toggleExpanded, selectNode, tabbableId, setActiveId, focusByOffset, focusEdge, focusParent } =
		useTreeContext();
	const isExpanded = expanded.has(node.id);
	const isSelected = selected.has(node.id);
	const hasChildren = !!(node.children && node.children.length > 0);
	const disabled = !!node.disabled;

	const itemRef = React.useRef<HTMLDivElement | null>(null);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;
		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				// Collapsed parent: expand. Expanded parent: move into the first child.
				if (hasChildren && !isExpanded) toggleExpanded(node.id);
				else if (hasChildren && isExpanded) focusByOffset(node.id, 1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				// Expanded parent: collapse. Otherwise move to the parent node.
				if (hasChildren && isExpanded) toggleExpanded(node.id);
				else focusParent(node.id);
				break;
			case 'ArrowDown':
				e.preventDefault();
				focusByOffset(node.id, 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusByOffset(node.id, -1);
				break;
			case 'Home':
				e.preventDefault();
				focusEdge('first');
				break;
			case 'End':
				e.preventDefault();
				focusEdge('last');
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				selectNode(node.id);
				break;
		}
	};

	const state: TreeItemState = {
		level,
		expanded: isExpanded,
		selected: isSelected,
		hasChildren,
		disabled,
		toggle: () => toggleExpanded(node.id),
		select: () => selectNode(node.id),
	};

	return (
		<>
			<div
				ref={itemRef}
				role='treeitem'
				data-id={node.id}
				// Roving tabindex: only the active node is tabbable so Tab exits the tree.
				tabIndex={!disabled && tabbableId === node.id ? 0 : -1}
				aria-expanded={hasChildren ? isExpanded : undefined}
				aria-selected={isSelected || undefined}
				aria-level={level}
				aria-disabled={disabled || undefined}
				data-state={isExpanded ? 'open' : 'closed'}
				data-selected={isSelected ? '' : undefined}
				data-disabled={disabled ? '' : undefined}
				data-level={level}
				data-has-children={hasChildren ? '' : undefined}
				onKeyDown={handleKeyDown}
				onFocus={(e) => {
					// Roving tabindex follows focus.
					if (e.target === e.currentTarget) setActiveId(node.id);
				}}
				onClick={(e) => {
					// Only act when clicking the item itself, not nested triggers handling their own clicks.
					if (e.currentTarget !== e.target && !(e.target as HTMLElement).closest('[data-tree-toggle]')) {
						return;
					}
					e.stopPropagation();
				}}>
				{renderItem(node, state)}
			</div>
			{hasChildren && isExpanded && (
				<div role='group'>
					{node.children!.map((child) => (
						<TreeItem
							key={child.id}
							node={child}
							level={level + 1}
							renderItem={renderItem}
						/>
					))}
				</div>
			)}
		</>
	);
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const TreeView = { Root };
