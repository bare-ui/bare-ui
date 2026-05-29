import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Show } from 'solid-js';
import { Markdown } from './Markdown';
import type { MarkdownComponents, MarkdownNode } from './Markdown.types';

const meta = {
	title: 'AI/Markdown',
	component: Markdown,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Headless Markdown renderer. Bring your own parser (`remark`/`marked`) — Wire UI exposes the render parts via the `components` map so you control every element.',
			},
		},
	},
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const doc: MarkdownNode[] = [
	{ type: 'heading', depth: 2, children: [{ type: 'text', value: 'Wire UI' }] },
	{
		type: 'paragraph',
		children: [
			{ type: 'text', value: 'A headless library with ' },
			{ type: 'strong', children: [{ type: 'text', value: 'zero CSS' }] },
			{ type: 'text', value: ' and ' },
			{ type: 'emphasis', children: [{ type: 'text', value: 'full control' }] },
			{ type: 'text', value: '.' },
		],
	},
	{
		type: 'list',
		ordered: false,
		children: [
			{ type: 'listItem', children: [{ type: 'text', value: 'Compound components' }] },
			{ type: 'listItem', children: [{ type: 'text', value: 'data-* styling' }] },
			{
				type: 'listItem',
				children: [
					{ type: 'text', value: 'Install ' },
					{ type: 'inlineCode', value: '@wire-ui/solid' },
				],
			},
		],
	},
	{
		type: 'blockquote',
		children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Style it however you like.' }] }],
	},
	{ type: 'code', lang: 'bash', value: 'npm i @wire-ui/solid' },
];

const styled: MarkdownComponents = {
	heading: (props) => (
		<Show
			when={props.node.depth === 2}
			fallback={<h3 class='mb-1 text-lg font-semibold text-black'>{props.children}</h3>}>
			<h2 class='mb-2 text-xl font-semibold text-black'>{props.children}</h2>
		</Show>
	),
	paragraph: (props) => <p class='mb-3 text-sm leading-relaxed text-[#374151]'>{props.children}</p>,
	strong: (props) => <strong class='font-semibold text-black'>{props.children}</strong>,
	emphasis: (props) => <em class='italic'>{props.children}</em>,
	delete: (props) => <del class='text-[#9ca3af]'>{props.children}</del>,
	link: (props) => (
		<a
			href={props.node.url}
			class='font-medium text-black underline'>
			{props.children}
		</a>
	),
	inlineCode: (props) => (
		<code class='rounded bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.8em] text-black'>{props.node.value}</code>
	),
	code: (props) => (
		<pre class='mb-3 overflow-x-auto rounded-lg bg-black p-3 font-mono text-xs text-white'>
			<code>{props.node.value}</code>
		</pre>
	),
	list: (props) => (
		<Show
			when={props.node.ordered}
			fallback={<ul class='mb-3 list-disc space-y-1 pl-5 text-sm text-[#374151]'>{props.children}</ul>}>
			<ol class='mb-3 list-decimal space-y-1 pl-5 text-sm text-[#374151]'>{props.children}</ol>
		</Show>
	),
	listItem: (props) => <li>{props.children}</li>,
	blockquote: (props) => (
		<blockquote class='mb-3 border-l-2 border-[#d1d5db] pl-3 text-sm italic text-[#6b7280]'>
			{props.children}
		</blockquote>
	),
	thematicBreak: () => <hr class='mb-3 border-[#e5e7eb]' />,
};

export const Default: Story = {
	render: () => (
		<div class='max-w-lg'>
			<Markdown
				nodes={doc}
				components={styled}
			/>
		</div>
	),
};

function miniParse(src: string): MarkdownNode[] {
	return src
		.trim()
		.split('\n')
		.map((line) => {
			const heading = line.match(/^(#{1,6})\s+(.*)$/);
			if (heading) {
				return { type: 'heading', depth: heading[1].length, children: [{ type: 'text', value: heading[2] }] };
			}
			return { type: 'paragraph', children: [{ type: 'text', value: line }] };
		});
}

const richDoc: MarkdownNode[] = [
	{ type: 'heading', depth: 3, children: [{ type: 'text', value: 'Supported nodes' }] },
	{
		type: 'paragraph',
		children: [
			{ type: 'text', value: 'Links like ' },
			{ type: 'link', url: 'https://solidjs.com', children: [{ type: 'text', value: 'Solid' }] },
			{ type: 'text', value: ', ' },
			{ type: 'delete', children: [{ type: 'text', value: 'strikethrough' }] },
			{ type: 'text', value: ', and ordered lists all render.' },
		],
	},
	{
		type: 'list',
		ordered: true,
		children: [
			{ type: 'listItem', children: [{ type: 'text', value: 'First step' }] },
			{ type: 'listItem', children: [{ type: 'text', value: 'Second step' }] },
		],
	},
	{ type: 'thematicBreak' },
	{
		type: 'list',
		ordered: false,
		children: [
			{ type: 'listItem', checked: true, children: [{ type: 'text', value: 'Done' }] },
			{ type: 'listItem', checked: false, children: [{ type: 'text', value: 'Todo' }] },
		],
	},
];

export const Composed: Story = {
	render: () => (
		<div class='flex max-w-lg flex-col gap-8'>
			<div>
				<p class='mb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]'>Pre-parsed nodes</p>
				<Markdown
					nodes={richDoc}
					components={styled}
				/>
			</div>
			<div>
				<p class='mb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]'>
					Raw content via parse prop
				</p>
				<Markdown
					content={'# Heading\nA paragraph of text.\n## Subheading\nAnother line.'}
					parse={miniParse}
					components={styled}
				/>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const answer: MarkdownNode[] = [
			{
				type: 'paragraph',
				children: [
					{ type: 'text', value: 'To debounce an input, wrap the handler in ' },
					{ type: 'inlineCode', value: 'useMemo' },
					{ type: 'text', value: ' with a timer:' },
				],
			},
			{
				type: 'code',
				lang: 'ts',
				value: 'const onChange = useMemo(\n  () => debounce(setQuery, 300),\n  [],\n);',
			},
			{
				type: 'paragraph',
				children: [{ type: 'text', value: 'Key points to remember:' }],
			},
			{
				type: 'list',
				ordered: false,
				children: [
					{
						type: 'listItem',
						children: [
							{ type: 'text', value: 'Clear the timer on unmount to avoid ' },
							{ type: 'strong', children: [{ type: 'text', value: 'stale updates' }] },
							{ type: 'text', value: '.' },
						],
					},
					{
						type: 'listItem',
						children: [
							{ type: 'text', value: 'Keep the dependency array empty so the debounce is stable.' },
						],
					},
				],
			},
			{
				type: 'blockquote',
				children: [
					{
						type: 'paragraph',
						children: [{ type: 'text', value: 'Tip: 300ms is a good default for search inputs.' }],
					},
				],
			},
		];

		return (
			<div class='mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm'>
				<div class='mb-3 flex items-center gap-2 text-xs font-medium text-[#6b7280]'>
					<span class='inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-[0.65rem] text-white'>
						AI
					</span>
					Assistant
				</div>
				<Markdown
					nodes={answer}
					components={styled}
				/>
			</div>
		);
	},
};
