import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Markdown } from '.';
import type { MarkdownNode } from './Markdown.types';

const tree: MarkdownNode[] = [
	{ type: 'heading', depth: 2, children: [{ type: 'text', value: 'Title' }] },
	{
		type: 'paragraph',
		children: [
			{ type: 'text', value: 'Hello ' },
			{ type: 'strong', children: [{ type: 'text', value: 'bold' }] },
			{ type: 'text', value: ' and ' },
			{ type: 'emphasis', children: [{ type: 'text', value: 'italic' }] },
			{ type: 'text', value: '.' },
		],
	},
	{
		type: 'list',
		ordered: false,
		children: [
			{ type: 'listItem', children: [{ type: 'text', value: 'one' }] },
			{ type: 'listItem', children: [{ type: 'text', value: 'two' }] },
		],
	},
];

describe('Markdown', () => {
	it('renders a heading at the right level', () => {
		render({
			setup: () => () => h(Markdown, { nodes: tree }),
		});
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toHaveTextContent('Title');
	});

	it('renders inline emphasis as semantic elements', () => {
		const { container } = render({
			setup: () => () => h(Markdown, { nodes: tree }),
		});
		expect(container.querySelector('strong')).toHaveTextContent('bold');
		expect(container.querySelector('em')).toHaveTextContent('italic');
		expect(container.querySelector('p')).toHaveTextContent('Hello bold and italic.');
	});

	it('renders lists and list items', () => {
		render({
			setup: () => () => h(Markdown, { nodes: tree }),
		});
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
	});

	it('renders an ordered list with start', () => {
		const { container } = render({
			setup: () => () =>
				h(Markdown, {
					nodes: [
						{
							type: 'list',
							ordered: true,
							start: 3,
							children: [{ type: 'listItem', children: [{ type: 'text', value: 'x' }] }],
						},
					],
				}),
		});
		const ol = container.querySelector('ol');
		expect(ol).toHaveAttribute('start', '3');
	});

	it('renders links with href and title', () => {
		render({
			setup: () => () =>
				h(Markdown, {
					nodes: [
						{
							type: 'paragraph',
							children: [
								{
									type: 'link',
									url: 'https://wire-ui.com',
									title: 'home',
									children: [{ type: 'text', value: 'Wire UI' }],
								},
							],
						},
					],
				}),
		});
		const link = screen.getByRole('link', { name: 'Wire UI' });
		expect(link).toHaveAttribute('href', 'https://wire-ui.com');
		expect(link).toHaveAttribute('title', 'home');
	});

	it('renders fenced code with a language data attribute', () => {
		const { container } = render({
			setup: () => () =>
				h(Markdown, { nodes: [{ type: 'code', lang: 'ts', value: 'const x = 1' }] }),
		});
		const pre = container.querySelector('pre');
		expect(pre).toHaveAttribute('data-language', 'ts');
		expect(pre).toHaveTextContent('const x = 1');
	});

	it('renders task list items with a disabled checkbox', () => {
		const { container } = render({
			setup: () => () =>
				h(Markdown, {
					nodes: [
						{
							type: 'list',
							children: [
								{ type: 'listItem', checked: true, children: [{ type: 'text', value: 'done' }] },
								{ type: 'listItem', checked: false, children: [{ type: 'text', value: 'todo' }] },
							],
						},
					],
				}),
		});
		const boxes = container.querySelectorAll('input[type="checkbox"]');
		expect(boxes).toHaveLength(2);
		expect(boxes[0]).toBeChecked();
		expect(boxes[0]).toBeDisabled();
		expect(boxes[1]).not.toBeChecked();
	});

	it('lets consumers override a renderer via the components map', () => {
		render({
			setup: () => () =>
				h(Markdown, {
					nodes: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'Hi' }] }],
					components: {
						heading: (_props, { slots }) =>
							h('div', { 'data-testid': 'custom-heading' }, slots.default?.()),
					},
				}),
		});
		expect(screen.getByTestId('custom-heading')).toHaveTextContent('Hi');
	});

	it('falls back to rendering children for unknown node types', () => {
		render({
			setup: () => () =>
				h(Markdown, {
					nodes: [{ type: 'mystery', children: [{ type: 'text', value: 'still here' }] }],
				}),
		});
		expect(screen.getByText('still here')).toBeInTheDocument();
	});

	it('uses the parse function when given content', () => {
		const parse = (src: string): MarkdownNode[] => [
			{ type: 'paragraph', children: [{ type: 'text', value: src.toUpperCase() }] },
		];
		render({
			setup: () => () => h(Markdown, { content: 'hi', parse }),
		});
		expect(screen.getByText('HI')).toBeInTheDocument();
	});

	it('renders raw content as a paragraph when no parser is supplied', () => {
		const { container } = render({
			setup: () => () => h(Markdown, { content: 'just text' }),
		});
		expect(container.querySelector('p')).toHaveTextContent('just text');
	});
});
