import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, Show } from 'solid-js';
import { TreeView } from './TreeView';
import type { TreeNode } from './TreeView.types';

const meta = {
	title: 'Layout/TreeView',
	component: TreeView.Root,
	tags: ['autodocs'],
	args: { nodes: [], renderItem: () => null },
	parameters: {
		docs: {
			description: {
				component:
					'Recursive tree with expandable branches, optional single/multi selection, and full keyboard navigation.',
			},
		},
	},
} satisfies Meta<typeof TreeView.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const fileTree: TreeNode[] = [
	{
		id: 'src',
		label: 'src',
		children: [
			{
				id: 'src/components',
				label: 'components',
				children: [
					{ id: 'src/components/Button.tsx', label: 'Button.tsx' },
					{ id: 'src/components/Card.tsx', label: 'Card.tsx' },
					{
						id: 'src/components/Tabs',
						label: 'Tabs',
						children: [
							{ id: 'src/components/Tabs/index.ts', label: 'index.ts' },
							{ id: 'src/components/Tabs/Tabs.tsx', label: 'Tabs.tsx' },
						],
					},
				],
			},
			{ id: 'src/index.ts', label: 'index.ts' },
		],
	},
	{ id: 'package.json', label: 'package.json' },
	{ id: 'README.md', label: 'README.md' },
];

const rowCls =
	'flex items-center gap-1 px-2 py-1 text-sm text-black cursor-pointer rounded-[6px] hover:bg-[#f5f5f5] data-[selected]:bg-[#f5f5f5] data-[selected]:font-medium';

const toggleCls = 'inline-flex size-5 items-center justify-center rounded text-[#6b7280] hover:bg-[#e5e5e5]';

export const Default: Story = {
	render: () => (
		<div class='w-72 rounded-[20px] border border-black bg-white p-2'>
			<TreeView.Root
				nodes={fileTree}
				defaultExpanded={['src']}
				renderItem={(node, state) => (
					<div
						class={rowCls}
						style={{ 'padding-left': `${(state.level - 1) * 16 + 8}px` }}>
						<Show
							when={state.hasChildren}
							fallback={<span class='inline-block size-5' />}>
							<button
								data-tree-toggle
								onClick={(e) => {
									e.stopPropagation();
									state.toggle();
								}}
								class={toggleCls}>
								{state.expanded ? '▾' : '▸'}
							</button>
						</Show>
						<span>{node.label}</span>
					</div>
				)}
			/>
		</div>
	),
};

export const Composed: Story = {
	render: () => {
		const [selected, setSelected] = createSignal<string[]>([]);
		return (
			<div class='flex flex-col gap-2'>
				<div class='w-72 rounded-[20px] border border-black bg-white p-2'>
					<TreeView.Root
						nodes={fileTree}
						defaultExpanded={['src', 'src/components']}
						selectionMode='single'
						selected={selected()}
						onSelectionChange={setSelected}
						renderItem={(node, state) => (
							<div
								class={rowCls}
								style={{ 'padding-left': `${(state.level - 1) * 16 + 8}px` }}
								onClick={state.select}>
								<Show
									when={state.hasChildren}
									fallback={<span class='inline-block size-5' />}>
									<button
										data-tree-toggle
										onClick={(e) => {
											e.stopPropagation();
											state.toggle();
										}}
										class={toggleCls}>
										{state.expanded ? '▾' : '▸'}
									</button>
								</Show>
								<span>{node.label}</span>
							</div>
						)}
					/>
				</div>
				<p class='text-xs text-[#6b7280]'>
					Selected: <span class='font-medium text-black'>{selected()[0] ?? '∅'}</span>
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [selected, setSelected] = createSignal<string[]>(['src/components/Button.tsx']);

		return (
			<div class='flex flex-col gap-2'>
				<div class='w-80 rounded-[20px] border border-black bg-white p-2'>
					<TreeView.Root
						nodes={fileTree}
						defaultExpanded={['src', 'src/components', 'src/components/Tabs']}
						selectionMode='multiple'
						selected={selected()}
						onSelectionChange={setSelected}
						renderItem={(node, state) => (
							<div
								class={rowCls}
								style={{ 'padding-left': `${(state.level - 1) * 16 + 8}px` }}
								onClick={state.select}>
								<Show
									when={state.hasChildren}
									fallback={
										<span class='inline-flex size-5 items-center justify-center text-xs text-[#6b7280]'>
											·
										</span>
									}>
									<button
										data-tree-toggle
										onClick={(e) => {
											e.stopPropagation();
											state.toggle();
										}}
										class={toggleCls}>
										{state.expanded ? '▾' : '▸'}
									</button>
								</Show>
								<span class='flex-1'>{node.label}</span>
								<Show when={state.selected}>
									<span class='text-xs text-black'>✓</span>
								</Show>
							</div>
						)}
					/>
				</div>
				<p class='text-xs text-[#6b7280]'>
					{selected().length} selected · ↑/↓ to navigate · →/← to expand/collapse · Enter/Space to toggle
					selection
				</p>
			</div>
		);
	},
};
