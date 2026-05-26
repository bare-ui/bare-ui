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

// Apply classes by overriding the render parts — this is the "expose parts" contract.
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
	inlineCode: (props) => (
		<code class='rounded bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.8em] text-black'>{props.node.value}</code>
	),
	code: (props) => (
		<pre class='mb-3 overflow-x-auto rounded-lg bg-black p-3 font-mono text-xs text-white'>
			<code>{props.node.value}</code>
		</pre>
	),
	list: (props) => <ul class='mb-3 list-disc space-y-1 pl-5 text-sm text-[#374151]'>{props.children}</ul>,
	listItem: (props) => <li>{props.children}</li>,
	blockquote: (props) => (
		<blockquote class='mb-3 border-l-2 border-[#d1d5db] pl-3 text-sm italic text-[#6b7280]'>
			{props.children}
		</blockquote>
	),
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

/** A naïve line-based parser, just to show wiring up the `parse` prop. */
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

export const WithParser: Story = {
	render: () => (
		<div class='max-w-lg'>
			<Markdown
				content={'# Heading\nA paragraph of text.\n## Subheading\nAnother line.'}
				parse={miniParse}
				components={styled}
			/>
		</div>
	),
};
