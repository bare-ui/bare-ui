import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For, type JSX } from 'solid-js';
import { CodeBlock } from './CodeBlock';

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

const KEYWORDS = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while'];
const KEYWORD_SPLIT = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`);
function highlight(content: string): JSX.Element {
	return (
		<For each={content.split(KEYWORD_SPLIT)}>
			{(part) => (KEYWORDS.includes(part) ? <span class='text-purple-400'>{part}</span> : <span>{part}</span>)}
		</For>
	);
}

export const Default: Story = {
	render: () => (
		<CodeBlock.Root
			code={sample}
			language='js'
			class={shellCls}>
			<CodeBlock.CopyButton class={copyCls}>{({ copied }) => (copied ? 'Copied!' : 'Copy')}</CodeBlock.CopyButton>
			<CodeBlock.Code class={preCls}>
				<CodeBlock.Lines>
					{({ line }) => (
						<>
							<span class={gutterCls}>{line.number}</span>
							{line.content}
						</>
					)}
				</CodeBlock.Lines>
			</CodeBlock.Code>
		</CodeBlock.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex flex-col gap-6'>
			<CodeBlock.Root
				code={sample}
				language='js'
				highlightLines={[2]}
				class={shellCls}>
				<CodeBlock.CopyButton class={copyCls}>{({ copied }) => (copied ? 'Copied!' : 'Copy')}</CodeBlock.CopyButton>
				<CodeBlock.Code class={preCls}>
					<CodeBlock.Lines>
						{({ line }) => (
							<span class={`block px-2${line.highlighted ? ' bg-white/10' : ''}`}>
								<span class={gutterCls}>{line.number}</span>
								{highlight(line.content)}
							</span>
						)}
					</CodeBlock.Lines>
				</CodeBlock.Code>
			</CodeBlock.Root>

			<CodeBlock.Root
				code={'const total = price\nconst total = price * qty\nreturn total'}
				language='js'
				diff={{ 1: 'remove', 2: 'add' }}
				class={shellCls}>
				<CodeBlock.CopyButton class={copyCls}>{({ copied }) => (copied ? 'Copied!' : 'Copy')}</CodeBlock.CopyButton>
				<CodeBlock.Code class={preCls}>
					<CodeBlock.Lines>
						{({ line }) => (
							<span
								class={
									line.diff === 'add' ?
										'block bg-green-500/15 before:mr-2 before:text-green-400 before:content-["+"]'
									: line.diff === 'remove' ?
										'block bg-red-500/15 before:mr-2 before:text-red-400 before:content-["-"]'
									:	'block before:mr-2 before:text-transparent before:content-["·"]'
								}>
								{line.content}
							</span>
						)}
					</CodeBlock.Lines>
				</CodeBlock.Code>
			</CodeBlock.Root>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const snippet = `import { Button } from '@wire-ui/react';

export function Save() {
  return <Button onClick={save}>Save</Button>;
}`;

		return (
			<div class='mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm'>
				<div class='mb-3 flex items-center gap-2 text-xs font-medium text-[#6b7280]'>
					<span class='inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-[0.65rem] text-white'>
						AI
					</span>
					Assistant
				</div>
				<p class='mb-3 text-sm leading-relaxed text-[#374151]'>
					Here is how you wire up the <code>Button</code> component:
				</p>
				<CodeBlock.Root
					code={snippet}
					language='tsx'
					class={shellCls}>
					<div class='flex items-center justify-between border-b border-[#27272a] px-4 py-2'>
						<span class='text-xs font-medium text-[#a1a1aa]'>example.tsx</span>
						<CodeBlock.CopyButton class='rounded-md border border-[#3f3f46] bg-[#27272a] px-2 py-1 text-xs text-[#a1a1aa] transition-colors hover:text-white data-[copied]:text-green-400'>
							{({ copied }) => (copied ? 'Copied!' : 'Copy')}
						</CodeBlock.CopyButton>
					</div>
					<CodeBlock.Code class={preCls}>
						<CodeBlock.Lines>
							{({ line }) => (
								<span class='block px-2'>
									<span class={gutterCls}>{line.number}</span>
									{highlight(line.content)}
								</span>
							)}
						</CodeBlock.Lines>
					</CodeBlock.Code>
				</CodeBlock.Root>
			</div>
		);
	},
};
