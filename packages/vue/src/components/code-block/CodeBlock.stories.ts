import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CodeBlock } from '.';

const meta = {
	title: 'AI/CodeBlock',
	component: CodeBlock.Root,
	subcomponents: {
		'CodeBlock.Code': CodeBlock.Code,
		'CodeBlock.Lines': CodeBlock.Lines,
		'CodeBlock.CopyButton': CodeBlock.CopyButton,
	},
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
				h(
					CodeBlock.CopyButton,
					{ class: copyCls },
					{
						default: ({ copied }: { copied: boolean }) => (copied ? 'Copied!' : 'Copy'),
					},
				),
				h(CodeBlock.Code, { class: preCls }, () =>
					h(CodeBlock.Lines, null, {
						default: ({ line }: { line: { number: number; content: string } }) => [
							h('span', { class: gutterCls }, line.number),
							line.content,
						],
					}),
				),
			]),
	}),
};

/** BYO highlighting: a trivial keyword colorizer stands in for Shiki/Prism. */
const KEYWORDS = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while'];
const KEYWORD_SPLIT = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`);
function highlight(content: string) {
	return content
		.split(KEYWORD_SPLIT)
		.map((part, i) =>
			KEYWORDS.includes(part) ?
				h('span', { key: i, class: 'text-purple-400' }, part)
			:	h('span', { key: i }, part),
		);
}

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex flex-col gap-6' }, [
				h(CodeBlock.Root, { code: sample, language: 'js', highlightLines: [2], class: shellCls }, () => [
					h(
						CodeBlock.CopyButton,
						{ class: copyCls },
						{
							default: ({ copied }: { copied: boolean }) => (copied ? 'Copied!' : 'Copy'),
						},
					),
					h(CodeBlock.Code, { class: preCls }, () =>
						h(CodeBlock.Lines, null, {
							default: ({ line }: { line: { number: number; content: string; highlighted: boolean } }) =>
								h('span', { class: `block px-2${line.highlighted ? ' bg-white/10' : ''}` }, [
									h('span', { class: gutterCls }, line.number),
									...highlight(line.content),
								]),
						}),
					),
				]),

				h(
					CodeBlock.Root,
					{
						code: 'const total = price\nconst total = price * qty\nreturn total',
						language: 'js',
						diff: { 1: 'remove', 2: 'add' },
						class: shellCls,
					},
					() => [
						h(
							CodeBlock.CopyButton,
							{ class: copyCls },
							{
								default: ({ copied }: { copied: boolean }) => (copied ? 'Copied!' : 'Copy'),
							},
						),
						h(CodeBlock.Code, { class: preCls }, () =>
							h(CodeBlock.Lines, null, {
								default: ({ line }: { line: { content: string; diff?: string } }) =>
									h(
										'span',
										{
											class:
												line.diff === 'add' ?
													'block bg-green-500/15 before:mr-2 before:text-green-400 before:content-["+"]'
												: line.diff === 'remove' ?
													'block bg-red-500/15 before:mr-2 before:text-red-400 before:content-["-"]'
												:	'block before:mr-2 before:text-transparent before:content-["·"]',
										},
										line.content,
									),
							}),
						),
					],
				),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const snippet = `import { Button } from '@wire-ui/react';

export function Save() {
  return <Button onClick={save}>Save</Button>;
}`;

			return () =>
				h('div', { class: 'mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm' }, [
					h('div', { class: 'mb-3 flex items-center gap-2 text-xs font-medium text-[#6b7280]' }, [
						h(
							'span',
							{
								class: 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-[0.65rem] text-white',
							},
							'AI',
						),
						'Assistant',
					]),
					h('p', { class: 'mb-3 text-sm leading-relaxed text-[#374151]' }, [
						'Here is how you wire up the ',
						h('code', null, 'Button'),
						' component:',
					]),
					h(CodeBlock.Root, { code: snippet, language: 'tsx', class: shellCls }, () => [
						h('div', { class: 'flex items-center justify-between border-b border-[#27272a] px-4 py-2' }, [
							h('span', { class: 'text-xs font-medium text-[#a1a1aa]' }, 'example.tsx'),
							h(
								CodeBlock.CopyButton,
								{
									class: 'rounded-md border border-[#3f3f46] bg-[#27272a] px-2 py-1 text-xs text-[#a1a1aa] transition-colors hover:text-white data-[copied]:text-green-400',
								},
								{ default: ({ copied }: { copied: boolean }) => (copied ? 'Copied!' : 'Copy') },
							),
						]),
						h(CodeBlock.Code, { class: preCls }, () =>
							h(CodeBlock.Lines, null, {
								default: ({ line }: { line: { number: number; content: string } }) =>
									h('span', { class: 'block px-2' }, [
										h('span', { class: gutterCls }, line.number),
										...highlight(line.content),
									]),
							}),
						),
					]),
				]);
		},
	}),
};
