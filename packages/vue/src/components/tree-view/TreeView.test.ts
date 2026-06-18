import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
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

const row = (label: string): HTMLElement =>
	screen.getByText(label, { exact: false }).closest('[role=treeitem]') as HTMLElement;

describe('TreeView', () => {
	it('renders root nodes only by default (children collapsed)', () => {
		renderTree();
		expect(screen.getByText('src')).toBeInTheDocument();
		expect(screen.getByText('README.md')).toBeInTheDocument();
		expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
	});

	it('expands a node when toggle button is clicked', async () => {
		renderTree();
		await userEvent.click(screen.getByLabelText('expand src'));
		expect(screen.getByText('index.ts')).toBeInTheDocument();
		expect(screen.getByText('components')).toBeInTheDocument();
	});

	it('ArrowRight on collapsed node expands it', async () => {
		renderTree();
		row('src').focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByText('index.ts')).toBeInTheDocument();
	});

	it('ArrowLeft on expanded node collapses it', async () => {
		renderTree({ defaultExpanded: ['src'] });
		row('src').focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
	});

	it('selectionMode=single fires onSelectionChange with one id', async () => {
		const onSel = vi.fn();
		renderTree({ selectionMode: 'single', onSelectionChange: onSel });
		row('README.md').focus();
		await userEvent.keyboard('{Enter}');
		expect(onSel).toHaveBeenLastCalledWith(['README.md']);
	});

	it('selectionMode=multiple toggles items in/out', async () => {
		const onSel = vi.fn();
		renderTree({ selectionMode: 'multiple', defaultExpanded: ['src'], onSelectionChange: onSel });
		row('index.ts').focus();
		await userEvent.keyboard('{Enter}');
		row('README.md').focus();
		await userEvent.keyboard('{Enter}');
		const last = onSel.mock.calls[onSel.mock.calls.length - 1][0] as string[];
		expect(last.slice().sort()).toEqual(['README.md', 'src/index.ts'].sort());
	});

	it('aria-level reflects depth', () => {
		renderTree({ defaultExpanded: ['src', 'src/components'] });
		expect(row('src')).toHaveAttribute('aria-level', '1');
		expect(row('components')).toHaveAttribute('aria-level', '2');
		expect(row('Button.tsx')).toHaveAttribute('aria-level', '3');
	});

	describe('keyboard navigation', () => {
		it('exposes exactly one tabbable treeitem (roving tabindex)', () => {
			renderTree({ defaultExpanded: ['src'] });
			const tabbable = screen
				.getAllByRole('treeitem')
				.filter((i) => i.getAttribute('tabindex') === '0');
			expect(tabbable).toHaveLength(1);
			// Defaults to the first node.
			expect(tabbable[0]).toBe(row('src'));
		});

		it('ArrowDown/ArrowUp move through visible nodes in display order', async () => {
			renderTree({ defaultExpanded: ['src'] });
			row('src').focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(row('index.ts')).toHaveFocus();
			await userEvent.keyboard('{ArrowDown}');
			expect(row('components')).toHaveFocus();
			await userEvent.keyboard('{ArrowUp}');
			expect(row('index.ts')).toHaveFocus();
		});

		it('ArrowRight on an expanded node moves focus to the first child', async () => {
			renderTree({ defaultExpanded: ['src'] });
			row('src').focus();
			await userEvent.keyboard('{ArrowRight}');
			expect(row('index.ts')).toHaveFocus();
		});

		it('ArrowLeft on a leaf moves focus to the parent', async () => {
			renderTree({ defaultExpanded: ['src'] });
			row('index.ts').focus();
			await userEvent.keyboard('{ArrowLeft}');
			expect(row('src')).toHaveFocus();
		});

		it('Home/End jump to the first and last visible nodes', async () => {
			renderTree({ defaultExpanded: ['src', 'src/components'] });
			row('index.ts').focus();
			await userEvent.keyboard('{End}');
			await nextTick();
			expect(row('README.md')).toHaveFocus();
			await userEvent.keyboard('{Home}');
			await nextTick();
			expect(row('src')).toHaveFocus();
		});

		it('moves the roving tabindex to the focused node', async () => {
			renderTree({ defaultExpanded: ['src'] });
			row('src').focus();
			await userEvent.keyboard('{ArrowDown}');
			await nextTick();
			expect(row('index.ts')).toHaveAttribute('tabindex', '0');
			expect(row('src')).toHaveAttribute('tabindex', '-1');
		});
	});
});
