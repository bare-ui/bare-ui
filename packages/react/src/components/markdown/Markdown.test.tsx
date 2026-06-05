import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Markdown } from './Markdown';
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
		render(<Markdown nodes={tree} />);
		const h = screen.getByRole('heading', { level: 2 });
		expect(h).toHaveTextContent('Title');
	});

	it('renders inline emphasis as semantic elements', () => {
		const { container } = render(<Markdown nodes={tree} />);
		expect(container.querySelector('strong')).toHaveTextContent('bold');
		expect(container.querySelector('em')).toHaveTextContent('italic');
		expect(container.querySelector('p')).toHaveTextContent('Hello bold and italic.');
	});

	it('renders lists and list items', () => {
		render(<Markdown nodes={tree} />);
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
	});

	it('renders an ordered list with start', () => {
		const { container } = render(
			<Markdown
				nodes={[
					{
						type: 'list',
						ordered: true,
						start: 3,
						children: [{ type: 'listItem', children: [{ type: 'text', value: 'x' }] }],
					},
				]}
			/>,
		);
		const ol = container.querySelector('ol');
		expect(ol).toHaveAttribute('start', '3');
	});

	it('renders links with href and title', () => {
		render(
			<Markdown
				nodes={[
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
				]}
			/>,
		);
		const link = screen.getByRole('link', { name: 'Wire UI' });
		expect(link).toHaveAttribute('href', 'https://wire-ui.com');
		expect(link).toHaveAttribute('title', 'home');
	});

	it('renders fenced code with a language data attribute', () => {
		const { container } = render(
			<Markdown nodes={[{ type: 'code', lang: 'ts', value: 'const x = 1' }]} />,
		);
		const pre = container.querySelector('pre');
		expect(pre).toHaveAttribute('data-language', 'ts');
		expect(pre).toHaveTextContent('const x = 1');
	});

	it('renders task list items with a disabled checkbox', () => {
		const { container } = render(
			<Markdown
				nodes={[
					{
						type: 'list',
						children: [
							{ type: 'listItem', checked: true, children: [{ type: 'text', value: 'done' }] },
							{ type: 'listItem', checked: false, children: [{ type: 'text', value: 'todo' }] },
						],
					},
				]}
			/>,
		);
		const boxes = container.querySelectorAll('input[type="checkbox"]');
		expect(boxes).toHaveLength(2);
		expect(boxes[0]).toBeChecked();
		expect(boxes[0]).toBeDisabled();
		expect(boxes[1]).not.toBeChecked();
	});

	it('lets consumers override a renderer via the components map', () => {
		render(
			<Markdown
				nodes={[{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'Hi' }] }]}
				components={{
					heading: ({ children }) => <div data-testid='custom-heading'>{children}</div>,
				}}
			/>,
		);
		expect(screen.getByTestId('custom-heading')).toHaveTextContent('Hi');
	});

	it('falls back to rendering children for unknown node types', () => {
		render(
			<Markdown
				nodes={[
					{ type: 'mystery', children: [{ type: 'text', value: 'still here' }] },
				]}
			/>,
		);
		expect(screen.getByText('still here')).toBeInTheDocument();
	});

	it('uses the parse function when given content', () => {
		const parse = (src: string): MarkdownNode[] => [
			{ type: 'paragraph', children: [{ type: 'text', value: src.toUpperCase() }] },
		];
		render(
			<Markdown
				content='hi'
				parse={parse}
			/>,
		);
		expect(screen.getByText('HI')).toBeInTheDocument();
	});

	it('renders raw content as a paragraph when no parser is supplied', () => {
		const { container } = render(<Markdown content='just text' />);
		expect(container.querySelector('p')).toHaveTextContent('just text');
	});

	describe('URL sanitization (XSS-safe by default)', () => {
		it('drops a javascript: href on a link', () => {
			const { container } = render(
				<Markdown
					nodes={[
						{
							type: 'paragraph',
							children: [{ type: 'link', url: 'javascript:alert(1)', children: [{ type: 'text', value: 'click' }] }],
						},
					]}
				/>,
			);
			const a = container.querySelector('a');
			expect(a).toHaveTextContent('click');
			expect(a).not.toHaveAttribute('href');
		});

		it('keeps safe link URLs', () => {
			const { container } = render(
				<Markdown
					nodes={[
						{
							type: 'paragraph',
							children: [
								{ type: 'link', url: 'https://example.com', children: [{ type: 'text', value: 'ok' }] },
							],
						},
					]}
				/>,
			);
			expect(container.querySelector('a')).toHaveAttribute('href', 'https://example.com');
		});

		it('drops a javascript: image src but allows data: images', () => {
			const { container } = render(
				<Markdown
					nodes={[
						{ type: 'image', url: 'javascript:alert(1)', alt: 'bad' },
						{ type: 'image', url: 'data:image/png;base64,iVBORw0KGgo=', alt: 'ok' },
					]}
				/>,
			);
			const [bad, ok] = Array.from(container.querySelectorAll('img'));
			expect(bad).not.toHaveAttribute('src');
			expect(ok).toHaveAttribute('src', 'data:image/png;base64,iVBORw0KGgo=');
		});
	});
});
