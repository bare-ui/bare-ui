import { createContext, createMemo, createSignal, For, Show, splitProps, useContext, type JSX } from 'solid-js';
import type { TreeItemState, TreeNode, TreeViewContextValue, TreeViewRootProps } from './TreeView.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TreeContext = createContext<TreeViewContextValue | null>(null);

function useTreeContext() {
	const ctx = useContext(TreeContext);
	if (!ctx) throw new Error('TreeView compound components must be used within TreeView.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: TreeViewRootProps) {
	const [local, rest] = splitProps(props, [
		'nodes',
		'expanded',
		'defaultExpanded',
		'onExpandedChange',
		'selectionMode',
		'selected',
		'defaultSelected',
		'onSelectionChange',
		'renderItem',
		'class',
	]);

	const [uncontrolledExpanded, setUncontrolledExpanded] = createSignal<string[]>(local.defaultExpanded ?? []);
	const isExpControlled = () => local.expanded !== undefined;
	const expandedArr = () => (isExpControlled() ? (local.expanded as string[]) : uncontrolledExpanded());
	const expanded = createMemo(() => new Set(expandedArr()));

	const [uncontrolledSelected, setUncontrolledSelected] = createSignal<string[]>(local.defaultSelected ?? []);
	const isSelControlled = () => local.selected !== undefined;
	const selectedArr = () => (isSelControlled() ? (local.selected as string[]) : uncontrolledSelected());
	const selected = createMemo(() => new Set(selectedArr()));

	const selectionMode = () => local.selectionMode ?? 'none';

	const toggleExpanded = (id: string) => {
		const next = new Set(expanded());
		if (next.has(id)) next.delete(id);
		else next.add(id);
		const arr = Array.from(next);
		if (!isExpControlled()) setUncontrolledExpanded(arr);
		local.onExpandedChange?.(arr);
	};

	const selectNode = (id: string) => {
		const mode = selectionMode();
		if (mode === 'none') return;
		let next: string[];
		const set = selected();
		if (mode === 'single') {
			next = set.has(id) ? [] : [id];
		} else {
			const dup = new Set(set);
			if (dup.has(id)) dup.delete(id);
			else dup.add(id);
			next = Array.from(dup);
		}
		if (!isSelControlled()) setUncontrolledSelected(next);
		local.onSelectionChange?.(next);
	};

	const ctxValue: TreeViewContextValue = {
		get expanded() {
			return expanded();
		},
		get selected() {
			return selected();
		},
		get selectionMode() {
			return selectionMode();
		},
		toggleExpanded,
		selectNode,
	};

	return (
		<TreeContext.Provider value={ctxValue}>
			<div
				role='tree'
				aria-multiselectable={selectionMode() === 'multiple' ? true : undefined}
				class={local.class}
				{...rest}>
				<For each={local.nodes}>
					{(node) => (
						<TreeItem
							node={node}
							level={1}
							renderItem={local.renderItem}
						/>
					)}
				</For>
			</div>
		</TreeContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Internal recursive item
// ---------------------------------------------------------------------------

interface TreeItemProps {
	node: TreeNode;
	level: number;
	renderItem: TreeViewRootProps['renderItem'];
}

function TreeItem(props: TreeItemProps) {
	const ctx = useTreeContext();
	const isExpanded = () => ctx.expanded.has(props.node.id);
	const isSelected = () => ctx.selected.has(props.node.id);
	const hasChildren = () => !!(props.node.children && props.node.children.length > 0);
	const disabled = () => !!props.node.disabled;

	let itemRef: HTMLDivElement | undefined;

	const focusSibling = (offset: 1 | -1) => {
		const root = itemRef?.closest('[role="tree"]');
		if (!root) return;
		const all = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
		const idx = all.indexOf(itemRef as HTMLElement);
		const target = all[idx + offset];
		if (target) target.focus();
	};

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		if (disabled()) return;
		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				if (hasChildren() && !isExpanded()) ctx.toggleExpanded(props.node.id);
				else if (hasChildren() && isExpanded()) focusSibling(1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				if (hasChildren() && isExpanded()) ctx.toggleExpanded(props.node.id);
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
				ctx.selectNode(props.node.id);
				break;
		}
	};

	const state = (): TreeItemState => ({
		level: props.level,
		expanded: isExpanded(),
		selected: isSelected(),
		hasChildren: hasChildren(),
		disabled: disabled(),
		toggle: () => ctx.toggleExpanded(props.node.id),
		select: () => ctx.selectNode(props.node.id),
	});

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		// Only act when clicking the item itself, not nested triggers handling their own clicks.
		if (e.currentTarget !== e.target && !(e.target as HTMLElement).closest('[data-tree-toggle]')) {
			return;
		}
		e.stopPropagation();
	};

	return (
		<>
			<div
				ref={itemRef}
				role='treeitem'
				tabIndex={disabled() ? -1 : 0}
				aria-expanded={hasChildren() ? isExpanded() : undefined}
				aria-selected={isSelected() || undefined}
				aria-level={props.level}
				aria-disabled={disabled() || undefined}
				data-state={isExpanded() ? 'open' : 'closed'}
				data-selected={isSelected() ? '' : undefined}
				data-disabled={disabled() ? '' : undefined}
				data-level={props.level}
				data-has-children={hasChildren() ? '' : undefined}
				onKeyDown={handleKeyDown}
				onClick={handleClick}>
				{props.renderItem(props.node, state())}
			</div>
			<Show when={hasChildren() && isExpanded()}>
				<div role='group'>
					<For each={props.node.children}>
						{(child) => (
							<TreeItem
								node={child}
								level={props.level + 1}
								renderItem={props.renderItem}
							/>
						)}
					</For>
				</div>
			</Show>
		</>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const TreeView = { Root };
