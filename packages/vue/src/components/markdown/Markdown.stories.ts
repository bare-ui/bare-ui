import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Markdown } from '.';
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
					{ type: 'inlineCode', value: '@wire-ui/vue' },
				],
			},
		],
	},
	{
		type: 'blockquote',
		children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Style it however you like.' }] }],
	},
	{ type: 'code', lang: 'bash', value: 'npm i @wire-ui/vue' },
];

// Apply classes by overriding the render parts — this is the "expose parts" contract.
const styled: MarkdownComponents = {
	heading: (props, { slots }) =>
		props.node.depth === 2 ?
			h('h2', { class: 'mb-2 text-xl font-semibold text-black' }, slots.default?.())
		:	h('h3', { class: 'mb-1 text-lg font-semibold text-black' }, slots.default?.()),
	paragraph: (_props, { slots }) =>
		h('p', { class: 'mb-3 text-sm leading-relaxed text-[#374151]' }, slots.default?.()),
	strong: (_props, { slots }) =>
		h('strong', { class: 'font-semibold text-black' }, slots.default?.()),
	emphasis: (_props, { slots }) => h('em', { class: 'italic' }, slots.default?.()),
	inlineCode: (props) =>
		h('code', { class: 'rounded bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.8em] text-black' }, props.node.value),
	code: (props) =>
		h('pre', { class: 'mb-3 overflow-x-auto rounded-lg bg-black p-3 font-mono text-xs text-white' }, [
			h('code', props.node.value),
		]),
	list: (_props, { slots }) =>
		h('ul', { class: 'mb-3 list-disc space-y-1 pl-5 text-sm text-[#374151]' }, slots.default?.()),
	listItem: (_props, { slots }) => h('li', slots.default?.()),
	blockquote: (_props, { slots }) =>
		h('blockquote', { class: 'mb-3 border-l-2 border-[#d1d5db] pl-3 text-sm italic text-[#6b7280]' }, slots.default?.()),
};

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'max-w-lg' }, [
				h(Markdown, { nodes: doc, components: styled }),
			]),
	}),
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
	render: () => ({
		setup: () => () =>
			h('div', { class: 'max-w-lg' }, [
				h(Markdown, {
					content: '# Heading\nA paragraph of text.\n## Subheading\nAnother line.',
					parse: miniParse,
					components: styled,
				}),
			]),
	}),
};
