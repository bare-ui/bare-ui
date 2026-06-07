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

	let rootRef: HTMLDivElement | undefined;

	// Flattened display order of currently-visible rows — the basis for arrow,
	// Home/End, and parent navigation, and for the roving tabindex.
	const visible = createMemo(() => flattenVisible(local.nodes, expanded()));
	const enabledVisible = createMemo(() => visible().filter((v) => !v.disabled));

	const [activeId, setActiveId] = createSignal<string | null>(null);

	// Exactly one node is tabbable: the focused node if it's still visible/enabled,
	// otherwise the first enabled row, so Tab always reaches (and exits) the tree.
	const tabbableId = createMemo(() => {
		const id = activeId();
		const enabled = enabledVisible();
		if (id && enabled.some((v) => v.id === id)) return id;
		return enabled[0]?.id ?? null;
	});

	const focusId = (id: string) => {
		const el = rootRef?.querySelector<HTMLElement>(`[role="treeitem"][data-id="${CSS.escape(id)}"]`);
		el?.focus();
	};

	const focusByOffset = (fromId: string, delta: number) => {
		const enabled = enabledVisible();
		const idx = enabled.findIndex((v) => v.id === fromId);
		if (idx < 0) return;
		const target = enabled[idx + delta];
		if (target) {
			setActiveId(target.id);
			focusId(target.id);
		}
	};

	const focusEdge = (edge: 'first' | 'last') => {
		const enabled = enabledVisible();
		const target = edge === 'first' ? enabled[0] : enabled[enabled.length - 1];
		if (target) {
			setActiveId(target.id);
			focusId(target.id);
		}
	};

	const focusParent = (fromId: string) => {
		const entry = visible().find((v) => v.id === fromId);
		if (entry?.parentId) {
			setActiveId(entry.parentId);
			focusId(entry.parentId);
		}
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
		get tabbableId() {
			return tabbableId();
		},
		setActiveId,
		focusByOffset,
		focusEdge,
		focusParent,
	};

	return (
		<TreeContext.Provider value={ctxValue}>
			<div
				ref={rootRef}
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

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		if (disabled()) return;
		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				// Collapsed parent: expand. Expanded parent: move into the first child.
				if (hasChildren() && !isExpanded()) ctx.toggleExpanded(props.node.id);
				else if (hasChildren() && isExpanded()) ctx.focusByOffset(props.node.id, 1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				// Expanded parent: collapse. Otherwise move to the parent node.
				if (hasChildren() && isExpanded()) ctx.toggleExpanded(props.node.id);
				else ctx.focusParent(props.node.id);
				break;
			case 'ArrowDown':
				e.preventDefault();
				ctx.focusByOffset(props.node.id, 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				ctx.focusByOffset(props.node.id, -1);
				break;
			case 'Home':
				e.preventDefault();
				ctx.focusEdge('first');
				break;
			case 'End':
				e.preventDefault();
				ctx.focusEdge('last');
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
				data-id={props.node.id}
				// Roving tabindex: only the active node is tabbable so Tab exits the tree.
				tabIndex={!disabled() && ctx.tabbableId === props.node.id ? 0 : -1}
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
				onFocus={(e) => {
					// Roving tabindex follows focus.
					if (e.target === e.currentTarget) ctx.setActiveId(props.node.id);
				}}
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
