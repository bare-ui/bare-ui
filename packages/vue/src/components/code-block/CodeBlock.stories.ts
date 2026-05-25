import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CodeBlock } from '.';

const meta = {
	title: 'AI/CodeBlock',
	component: CodeBlock.Root,
	tags: ['autodocs'],
	args: { code: '' },
	parameters: {
		docs: {
			description: {
				component:
					'Code display with a copy button, line numbers and diff regions. Syntax highlighting is bring-your-own — render `line.content` through Shiki/Prism/etc. inside `CodeBlock.Lines`.',
			},
		},
	},
} satisfies Meta<typeof CodeBlock.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const sample = `function greet(name) {
  const message = "Hello, " + name;
  return message;
}`;

const shellCls =
	'relative w-full max-w-xl overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b] font-mono text-sm';
const copyCls =
	'absolute right-2 top-2 rounded-md border border-[#3f3f46] bg-[#27272a] px-2 py-1 text-xs text-[#a1a1aa] transition-colors hover:text-white data-[copied]:text-green-400';
const preCls = 'overflow-x-auto p-4 leading-relaxed text-[#e4e4e7]';
const gutterCls = 'mr-4 inline-block w-6 select-none text-right text-[#52525b]';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(CodeBlock.Root, { code: sample, language: 'js', class: shellCls }, () => [
				h(CodeBlock.CopyButton, { class: copyCls }, ({ copied }: { copied: boolean }) =>
					copied ? 'Copied!' : 'Copy',
				),
				h(CodeBlock.Code, { class: preCls }, () =>
					h(CodeBlock.Lines, null, ({ line }: { line: { number: number; content: string } }) => [
						h('span', { class: gutterCls }, line.number),
						line.content,
					]),
				),
			]),
	}),
};

export const DiffRegions: Story = {
	render: () => ({
		setup: () => () =>
			h(
				CodeBlock.Root,
				{
					code: 'const total = price\nconst total = price * qty\nreturn total',
					language: 'js',
					diff: { 1: 'remove', 2: 'add' },
					class: shellCls,
				},
				() => [
					h(CodeBlock.CopyButton, { class: copyCls }, ({ copied }: { copied: boolean }) =>
						copied ? 'Copied!' : 'Copy',
					),
					h(CodeBlock.Code, { class: preCls }, () =>
						h(
							CodeBlock.Lines,
							null,
							({ line }: { line: { content: string; diff?: string } }) =>
								h(
									'span',
									{
										class:
											line.diff === 'add'
												? 'block bg-green-500/15 before:mr-2 before:text-green-400 before:content-["+"]'
												: line.diff === 'remove'
													? 'block bg-red-500/15 before:mr-2 before:text-red-400 before:content-["-"]'
													: 'block before:mr-2 before:text-transparent before:content-["·"]',
									},
									line.content,
								),
						),
					),
				],
			),
	}),
};

export const HighlightedLines: Story = {
	render: () => ({
		setup: () => () =>
			h(
				CodeBlock.Root,
				{ code: sample, language: 'js', highlightLines: [2], class: shellCls },
				() => [
					h(CodeBlock.CopyButton, { class: copyCls }, ({ copied }: { copied: boolean }) =>
						copied ? 'Copied!' : 'Copy',
					),
					h(CodeBlock.Code, { class: preCls }, () =>
						h(
							CodeBlock.Lines,
							null,
							({ line }: { line: { number: number; content: string; highlighted: boolean } }) =>
								h('span', { class: `block px-2${line.highlighted ? ' bg-white/10' : ''}` }, [
									h('span', { class: gutterCls }, line.number),
									line.content,
								]),
						),
					),
				],
			),
	}),
};
