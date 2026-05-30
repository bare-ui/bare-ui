import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Diff } from '.';
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

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Diff.Root, { oldValue: before, newValue: after, class: shellCls }, () =>
				h(Diff.Unified, null, {
					default: ({ line }: { line: DiffLine }) =>
						h('div', { class: `flex whitespace-pre px-1 ${lineClass(line.type)}` }, [
							h('span', { class: gutterCls }, line.oldLine ?? ''),
							h('span', { class: gutterCls }, line.newLine ?? ''),
							h('span', { class: 'px-2' }, sign(line.type)),
							h('span', null, line.content),
						]),
				}),
			),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-6' }, [
				h('div', null, [
					h(
						'p',
						{ class: 'mb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]' },
						'Unified',
					),
					h(Diff.Root, { oldValue: before, newValue: after, class: shellCls }, () => [
						h(Diff.Stats, null, {
							default: ({ additions, deletions }: { additions: number; deletions: number }) =>
								h(
									'div',
									{
										class: 'flex gap-3 border-b border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[#6b7280]',
									},
									[
										h('span', { class: 'text-green-600' }, `+${additions}`),
										h('span', { class: 'text-red-600' }, `−${deletions}`),
									],
								),
						}),
						h(Diff.Unified, null, {
							default: ({ line }: { line: DiffLine }) =>
								h('div', { class: `flex whitespace-pre px-1 ${lineClass(line.type)}` }, [
									h('span', { class: gutterCls }, line.oldLine ?? ''),
									h('span', { class: gutterCls }, line.newLine ?? ''),
									h('span', { class: 'px-2' }, sign(line.type)),
									h('span', null, line.content),
								]),
						}),
					]),
				]),
				h('div', null, [
					h(
						'p',
						{ class: 'mb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]' },
						'Split',
					),
					h(Diff.Root, { oldValue: before, newValue: after, class: shellCls }, () =>
						h(Diff.Split, null, {
							default: ({ left, right }: { left?: DiffLine; right?: DiffLine }) =>
								h('div', { class: 'grid grid-cols-2 divide-x divide-[#e5e7eb]' }, [
									h(
										'div',
										{
											class: `flex whitespace-pre px-1 ${left ? lineClass(left.type) : 'bg-[#fafafa]'}`,
										},
										[
											h('span', { class: gutterCls }, left?.oldLine ?? ''),
											h('span', null, left?.content ?? ''),
										],
									),
									h(
										'div',
										{
											class: `flex whitespace-pre px-1 ${right ? lineClass(right.type) : 'bg-[#fafafa]'}`,
										},
										[
											h('span', { class: gutterCls }, right?.newLine ?? ''),
											h('span', null, right?.content ?? ''),
										],
									),
								]),
						}),
					),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const oldFile = `export function add(a, b) {
  return a + b;
}

export function mul(a, b) {
  return a * b;
}`;

			const newFile = `export function add(a, b) {
  return a + b;
}

export function mul(a, b) {
  return a * b;
}

export function sub(a, b) {
  return a - b;
}`;

			return () =>
				h(
					'div',
					{
						class: 'mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-[#e5e7eb] bg-white',
					},
					[
						h(Diff.Root, { oldValue: oldFile, newValue: newFile }, () => [
							h(
								'div',
								{
									class: 'flex items-center justify-between border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-2',
								},
								[
									h('span', { class: 'font-mono text-xs text-[#374151]' }, 'src/math.ts'),
									h(Diff.Stats, null, {
										default: ({
											additions,
											deletions,
										}: {
											additions: number;
											deletions: number;
										}) =>
											h('div', { class: 'flex gap-3 text-xs' }, [
												h('span', { class: 'text-green-600' }, `+${additions}`),
												h('span', { class: 'text-red-600' }, `−${deletions}`),
											]),
									}),
								],
							),
							h(Diff.Unified, null, {
								default: ({ line }: { line: DiffLine }) =>
									h(
										'div',
										{ class: `flex whitespace-pre px-1 font-mono text-xs ${lineClass(line.type)}` },
										[
											h('span', { class: gutterCls }, line.oldLine ?? ''),
											h('span', { class: gutterCls }, line.newLine ?? ''),
											h('span', { class: 'px-2' }, sign(line.type)),
											h('span', null, line.content),
										],
									),
							}),
						]),
					],
				);
		},
	}),
};
