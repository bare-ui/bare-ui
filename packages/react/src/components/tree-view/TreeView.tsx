import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
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

		const ctx = useMemo<TreeViewContextValue>(
			() => ({ expanded, selected, selectionMode, toggleExpanded, selectNode }),
			[expanded, selected, selectionMode, toggleExpanded, selectNode],
		);

		return (
			<TreeContext.Provider value={ctx}>
				<div
					ref={ref}
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
	const { expanded, selected, toggleExpanded, selectNode } = useTreeContext();
	const isExpanded = expanded.has(node.id);
	const isSelected = selected.has(node.id);
	const hasChildren = !!(node.children && node.children.length > 0);
	const disabled = !!node.disabled;

	const itemRef = React.useRef<HTMLDivElement | null>(null);

	const focusSibling = (offset: 1 | -1) => {
		const root = itemRef.current?.closest('[role="tree"]');
		if (!root) return;
		const all = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
		const idx = all.indexOf(itemRef.current as HTMLElement);
		const target = all[idx + offset];
		if (target) target.focus();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;
		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				if (hasChildren && !isExpanded) toggleExpanded(node.id);
				else if (hasChildren && isExpanded) focusSibling(1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				if (hasChildren && isExpanded) toggleExpanded(node.id);
				else focusSibling(-1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				focusSibling(1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusSibling(-1);
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
				tabIndex={disabled ? -1 : 0}
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
