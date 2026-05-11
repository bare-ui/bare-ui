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
