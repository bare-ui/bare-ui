import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { TreeView } from '.';
import type { TreeItemState, TreeNode } from './TreeView.types';

const meta = {
	title: 'Layout/TreeView',
	component: TreeView.Root,
	tags: ['autodocs'],
	args: { nodes: [] },
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

function renderRow(node: TreeNode, state: TreeItemState) {
	return h(
		'div',
		{
			class: rowCls,
			style: { paddingLeft: `${(state.level - 1) * 16 + 8}px` },
		},
		[
			state.hasChildren
				? h(
						'button',
						{
							'data-tree-toggle': '',
							onClick: (e: MouseEvent) => {
								e.stopPropagation()
								state.toggle()
							},
							class: toggleCls,
						},
						state.expanded ? '▾' : '▸',
					)
				: h('span', { class: 'inline-block size-5' }),
			h('span', {}, node.label),
		],
	);
}

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(
				'div',
				{ class: 'w-72 rounded-[20px] border border-black bg-white p-2' },
				[
					h(
						TreeView.Root,
						{ nodes: fileTree, defaultExpanded: ['src'] },
						{
							default: ({ node, state }: { node: TreeNode; state: TreeItemState }) =>
								renderRow(node, state),
						},
					),
				],
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const selected = ref<string[]>([]);
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h(
						'div',
						{ class: 'w-72 rounded-[20px] border border-black bg-white p-2' },
						[
							h(
								TreeView.Root,
								{
									nodes: fileTree,
									defaultExpanded: ['src', 'src/components'],
									selectionMode: 'single',
									selected: selected.value,
									onSelectionChange: (s: string[]) => (selected.value = s),
								},
								{
									default: ({ node, state }: { node: TreeNode; state: TreeItemState }) =>
										h(
											'div',
											{
												class: rowCls,
												style: { paddingLeft: `${(state.level - 1) * 16 + 8}px` },
												onClick: state.select,
											},
											[
												state.hasChildren
													? h(
															'button',
															{
																'data-tree-toggle': '',
																onClick: (e: MouseEvent) => {
																	e.stopPropagation()
																	state.toggle()
																},
																class: toggleCls,
															},
															state.expanded ? '▾' : '▸',
														)
													: h('span', { class: 'inline-block size-5' }),
												h('span', {}, node.label),
											],
										),
								},
							),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, [
						'Selected: ',
						h('span', { class: 'font-medium text-black' }, selected.value[0] ?? '∅'),
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const selected = ref<string[]>(['src/components/Button.tsx']);
			return () =>
				h('div', { class: 'flex flex-col gap-2' }, [
					h(
						'div',
						{ class: 'w-80 rounded-[20px] border border-black bg-white p-2' },
						[
							h(
								TreeView.Root,
								{
									nodes: fileTree,
									defaultExpanded: ['src', 'src/components', 'src/components/Tabs'],
									selectionMode: 'multiple',
									selected: selected.value,
									onSelectionChange: (s: string[]) => (selected.value = s),
								},
								{
									default: ({ node, state }: { node: TreeNode; state: TreeItemState }) =>
										h(
											'div',
											{
												class: rowCls,
												style: { paddingLeft: `${(state.level - 1) * 16 + 8}px` },
												onClick: state.select,
											},
											[
												state.hasChildren
													? h(
															'button',
															{
																'data-tree-toggle': '',
																onClick: (e: MouseEvent) => {
																	e.stopPropagation()
																	state.toggle()
																},
																class: toggleCls,
															},
															state.expanded ? '▾' : '▸',
														)
													: h(
															'span',
															{
																class: 'inline-flex size-5 items-center justify-center text-xs text-[#6b7280]',
															},
															'·',
														),
												h('span', { class: 'flex-1' }, node.label),
												state.selected
													? h('span', { class: 'text-xs text-black' }, '✓')
													: null,
											],
										),
								},
							),
						],
					),
					h(
						'p',
						{ class: 'text-xs text-[#6b7280]' },
						`${selected.value.length} selected · ↑/↓ to navigate · →/← to expand/collapse · Enter/Space to toggle selection`,
					),
				]);
		},
	}),
};
