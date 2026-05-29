import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Diff } from './Diff';
import type { DiffLine } from './Diff.types';

const meta = {
	title: 'AI/Diff',
	component: Diff.Root,
	subcomponents: {
		'Diff.Unified': Diff.Unified,
		'Diff.Split': Diff.Split,
		'Diff.Stats': Diff.Stats,
	},
	tags: ['autodocs'],
	args: { oldValue: '', newValue: '' },
	parameters: {
		docs: {
			description: {
				component:
					'Line-level diff viewer with both unified and side-by-side (split) layouts. The diff is computed with a built-in LCS algorithm — no dependencies — and exposed as render parts you style yourself.',
			},
		},
	},
} satisfies Meta<typeof Diff.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const before = `function sum(a, b) {
  return a + b;
}

const result = sum(1, 2);`;

const after = `function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

const result = sum(1, 2, 3);`;

const shellCls = 'w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5e7eb] font-mono text-xs';
const gutterCls = 'inline-block w-8 select-none px-2 text-right text-[#9ca3af]';

function lineClass(type: DiffLine['type']) {
	if (type === 'insert') return 'bg-green-50 text-green-900';
	if (type === 'delete') return 'bg-red-50 text-red-900';
	return 'text-[#374151]';
}

function sign(type: DiffLine['type']) {
	if (type === 'insert') return '+';
	if (type === 'delete') return '-';
	return ' ';
}

export const Unified: Story = {
	render: () => (
		<Diff.Root
			oldValue={before}
			newValue={after}
			class={shellCls}>
			<Diff.Stats>
				{({ additions, deletions }) => (
					<div class='flex gap-3 border-b border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[#6b7280]'>
						<span class='text-green-600'>+{additions}</span>
						<span class='text-red-600'>−{deletions}</span>
					</div>
				)}
			</Diff.Stats>
			<Diff.Unified>
				{({ line }) => (
					<div class={`flex whitespace-pre px-1 ${lineClass(line.type)}`}>
						<span class={gutterCls}>{line.oldLine ?? ''}</span>
						<span class={gutterCls}>{line.newLine ?? ''}</span>
						<span class='px-2'>{sign(line.type)}</span>
						<span>{line.content}</span>
					</div>
				)}
			</Diff.Unified>
		</Diff.Root>
	),
};

export const Split: Story = {
	render: () => (
		<Diff.Root
			oldValue={before}
			newValue={after}
			class={shellCls}>
			<Diff.Split>
				{({ left, right }) => (
					<div class='grid grid-cols-2 divide-x divide-[#e5e7eb]'>
						<div class={`flex whitespace-pre px-1 ${left ? lineClass(left.type) : 'bg-[#fafafa]'}`}>
							<span class={gutterCls}>{left?.oldLine ?? ''}</span>
							<span>{left?.content ?? ''}</span>
						</div>
						<div class={`flex whitespace-pre px-1 ${right ? lineClass(right.type) : 'bg-[#fafafa]'}`}>
							<span class={gutterCls}>{right?.newLine ?? ''}</span>
							<span>{right?.content ?? ''}</span>
						</div>
					</div>
				)}
			</Diff.Split>
		</Diff.Root>
	),
};
