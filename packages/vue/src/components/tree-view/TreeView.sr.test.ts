/**
 * Screen-reader semantics for TreeView. Verifies the ARIA tree pattern a
 * screen reader navigates — role=tree, role=treeitem, aria-expanded,
 * aria-level, aria-selected, aria-multiselectable, and aria-disabled.
 *
 * Each treeitem is exposed with its nesting level (aria-level), expand/collapse
 * state (aria-expanded) for parent nodes only, and selection state (aria-selected)
 * when selection is enabled. Disabled nodes surface aria-disabled="true".
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { TreeView } from '.';
import type { TreeNode } from '.';

const { Root: TreeViewRoot } = TreeView;

const nodes: TreeNode[] = [
	{
		id: 'src',
		label: 'src',
		children: [
			{ id: 'src/index.ts', label: 'index.ts' },
			{
				id: 'src/components',
				label: 'components',
				children: [{ id: 'src/components/Button.tsx', label: 'Button.tsx' }],
			},
		],
	},
	{ id: 'README.md', label: 'README.md' },
];

function renderTree(props: Record<string, unknown> = {}) {
	return render({
		template: `
			<TreeViewRoot :nodes="treeNodes" v-bind="rootProps">
				<template #default="{ node, state }">
					<span :data-testid="'row-' + node.id">
						<button
							v-if="state.hasChildren"
							data-tree-toggle
							:aria-label="state.expanded ? 'collapse ' + node.id : 'expand ' + node.id"
							@click.stop="state.toggle"
						>
							{{ state.expanded ? '▾' : '▸' }}
						</button>
						{{ node.label }}
					</span>
				</template>
			</TreeViewRoot>
		`,
		components: { TreeViewRoot },
		setup() {
			return { treeNodes: nodes, rootProps: props };
		},
	});
}

function treeItem(label: string): HTMLElement {
	return screen.getByText(label, { exact: false }).closest('[role=treeitem]') as HTMLElement;
}

describe('TreeView — screen reader semantics', () => {
	it('exposes the container as a tree of treeitems', () => {
		renderTree();
		expect(screen.getByRole('tree')).toBeInTheDocument();
		expect(screen.getAllByRole('treeitem').length).toBeGreaterThan(0);
	});

	it('exposes parent nodes as collapsed (aria-expanded=false) and leaves with no expanded state', () => {
		renderTree();
		expect(treeItem('src')).toHaveAttribute('aria-expanded', 'false');
		// A leaf node must NOT advertise an expand affordance.
		expect(treeItem('README.md')).not.toHaveAttribute('aria-expanded');
	});

	it('transitions aria-expanded false → true when a parent is opened', async () => {
		renderTree();
		expect(treeItem('src')).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(screen.getByLabelText('expand src'));
		expect(treeItem('src')).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes aria-level reflecting nesting depth for SR position-in-set', () => {
		renderTree({ defaultExpanded: ['src', 'src/components'] });
		expect(treeItem('src')).toHaveAttribute('aria-level', '1');
		expect(treeItem('components')).toHaveAttribute('aria-level', '2');
		expect(treeItem('Button.tsx')).toHaveAttribute('aria-level', '3');
	});

	it('does not expose aria-selected when selection is disabled', () => {
		renderTree();
		expect(treeItem('README.md')).not.toHaveAttribute('aria-selected');
	});

	it('exposes aria-selected once an item is selected (single mode)', async () => {
		renderTree({ selectionMode: 'single' });
		const row = treeItem('README.md');
		expect(row).not.toHaveAttribute('aria-selected');
		row.focus();
		await userEvent.keyboard('{Enter}');
		expect(row).toHaveAttribute('aria-selected', 'true');
	});

	it('advertises multi-selectability via aria-multiselectable on the tree', () => {
		renderTree({ selectionMode: 'multiple' });
		expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('exposes a disabled node via aria-disabled', () => {
		renderTree({
			nodes: [{ id: 'locked', label: 'locked', disabled: true }],
		});
		expect(treeItem('locked')).toHaveAttribute('aria-disabled', 'true');
	});
});
