import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Show, type ComponentProps } from 'solid-js';
import { TreeView } from './TreeView';
import type { TreeNode } from './TreeView.types';

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

function renderTree(props: Partial<ComponentProps<typeof TreeView.Root>> = {}) {
	return render(() => (
		<TreeView.Root
			nodes={nodes}
			renderItem={(node, state) => (
				<span data-testid={`row-${node.id}`}>
					<Show when={state.hasChildren}>
						<button
							data-tree-toggle
							aria-label={state.expanded ? `collapse ${node.id}` : `expand ${node.id}`}
							onClick={state.toggle}>
							{state.expanded ? '▾' : '▸'}
						</button>
					</Show>
					{node.label as string}
				</span>
			)}
			{...props}
		/>
	));
}

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
		const srcRow = screen.getByText('src').closest('[role=treeitem]') as HTMLElement;
		srcRow.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByText('index.ts')).toBeInTheDocument();
	});

	it('ArrowLeft on expanded node collapses it', async () => {
		renderTree({ defaultExpanded: ['src'] });
		const srcRow = screen.getByText('src').closest('[role=treeitem]') as HTMLElement;
		srcRow.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
	});

	it('selectionMode=single fires onSelectionChange with one id', async () => {
		const onSel = vi.fn();
		renderTree({ selectionMode: 'single', onSelectionChange: onSel });
		const row = screen.getByText('README.md').closest('[role=treeitem]') as HTMLElement;
		row.focus();
		await userEvent.keyboard('{Enter}');
		expect(onSel).toHaveBeenLastCalledWith(['README.md']);
	});

	it('selectionMode=multiple toggles items in/out', async () => {
		const onSel = vi.fn();
		renderTree({ selectionMode: 'multiple', defaultExpanded: ['src'], onSelectionChange: onSel });
		const a = screen.getByText('index.ts').closest('[role=treeitem]') as HTMLElement;
		const b = screen.getByText('README.md').closest('[role=treeitem]') as HTMLElement;
		a.focus();
		await userEvent.keyboard('{Enter}');
		b.focus();
		await userEvent.keyboard('{Enter}');
		const last = onSel.mock.calls[onSel.mock.calls.length - 1][0] as string[];
		expect(last.sort()).toEqual(['README.md', 'src/index.ts'].sort());
	});

	// -------------------------------------------------------------------------
	// Roving tabindex + keyboard navigation
	// -------------------------------------------------------------------------

	function treeItem(label: string): HTMLElement {
		return screen.getByText(label).closest('[role=treeitem]') as HTMLElement;
	}

	it('roving tabindex: exactly one visible node is tabbable', () => {
		renderTree({ defaultExpanded: ['src'] });
		const items = screen.getAllByRole('treeitem');
		const tabbable = items.filter((i) => i.tabIndex === 0);
		expect(tabbable).toHaveLength(1);
		// First visible node is the default tabbable one.
		expect(treeItem('src').tabIndex).toBe(0);
	});

	it('ArrowDown moves to the next visible node, ArrowUp to the previous', async () => {
		renderTree({ defaultExpanded: ['src'] });
		treeItem('src').focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(document.activeElement).toBe(treeItem('index.ts'));
		await userEvent.keyboard('{ArrowDown}');
		expect(document.activeElement).toBe(treeItem('components'));
		await userEvent.keyboard('{ArrowUp}');
		expect(document.activeElement).toBe(treeItem('index.ts'));
	});

	it('ArrowDown descends into expanded children (visible order, not siblings)', async () => {
		renderTree({ defaultExpanded: ['src'] });
		// Visible order: src, index.ts, components, README.md
		treeItem('src').focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(document.activeElement).toBe(treeItem('index.ts'));
	});

	it('ArrowRight on an expanded node moves into its first child', async () => {
		renderTree({ defaultExpanded: ['src'] });
		treeItem('src').focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(document.activeElement).toBe(treeItem('index.ts'));
	});

	it('ArrowLeft on an expanded node collapses it (does not move focus)', async () => {
		renderTree({ defaultExpanded: ['src'] });
		treeItem('src').focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(treeItem('src'));
	});

	it('ArrowLeft on a collapsed/leaf node moves focus to its PARENT', async () => {
		renderTree({ defaultExpanded: ['src', 'src/components'] });
		// components is expanded; collapse it first so it becomes a collapsed parent.
		const components = treeItem('components');
		components.focus();
		await userEvent.keyboard('{ArrowLeft}'); // collapses components
		expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument();
		// Now ArrowLeft on the collapsed node moves to the parent (src).
		await userEvent.keyboard('{ArrowLeft}');
		expect(document.activeElement).toBe(treeItem('src'));
	});

	it('ArrowLeft on a leaf moves to its parent', async () => {
		renderTree({ defaultExpanded: ['src'] });
		const leaf = treeItem('index.ts');
		leaf.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(document.activeElement).toBe(treeItem('src'));
	});

	it('Home jumps to the first visible node, End to the last', async () => {
		renderTree({ defaultExpanded: ['src'] });
		treeItem('index.ts').focus();
		await userEvent.keyboard('{End}');
		// Last visible node is README.md.
		expect(document.activeElement).toBe(treeItem('README.md'));
		await userEvent.keyboard('{Home}');
		expect(document.activeElement).toBe(treeItem('src'));
	});

	it('roving tabindex follows focus', async () => {
		renderTree({ defaultExpanded: ['src'] });
		treeItem('src').focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(treeItem('index.ts').tabIndex).toBe(0);
		expect(treeItem('src').tabIndex).toBe(-1);
	});

	it('skips disabled nodes during arrow navigation', async () => {
		const dnodes: TreeNode[] = [
			{ id: 'a', label: 'a' },
			{ id: 'b', label: 'b', disabled: true },
			{ id: 'c', label: 'c' },
		];
		render(() => (
			<TreeView.Root
				nodes={dnodes}
				renderItem={(node) => <span>{node.label as string}</span>}
			/>
		));
		treeItem('a').focus();
		await userEvent.keyboard('{ArrowDown}');
		// b is disabled and skipped.
		expect(document.activeElement).toBe(treeItem('c'));
	});

	it('aria-level reflects depth', () => {
		renderTree({ defaultExpanded: ['src', 'src/components'] });
		const root = screen.getByText('src').closest('[role=treeitem]') as HTMLElement;
		const middle = screen.getByText('components').closest('[role=treeitem]') as HTMLElement;
		const deep = screen.getByText('Button.tsx').closest('[role=treeitem]') as HTMLElement;
		expect(root).toHaveAttribute('aria-level', '1');
		expect(middle).toHaveAttribute('aria-level', '2');
		expect(deep).toHaveAttribute('aria-level', '3');
	});
});
