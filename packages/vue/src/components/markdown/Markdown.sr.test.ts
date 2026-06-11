/**
 * Screen-reader semantics for Markdown. Rendered output must be real semantic
 * HTML so SR users can navigate by heading, walk lists, follow links and read
 * emphasis — the default renderers map markdown nodes onto native elements with
 * their implicit roles.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Markdown } from '.';
import type { MarkdownNode } from './Markdown.types';

const tree: MarkdownNode[] = [
	{ type: 'heading', depth: 2, children: [{ type: 'text', value: 'Overview' }] },
	{
		type: 'paragraph',
		children: [
			{ type: 'text', value: 'Hello ' },
			{ type: 'strong', children: [{ type: 'text', value: 'bold' }] },
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

describe('Markdown — screen reader semantics', () => {
	it('exposes headings at their level so SR can navigate by heading', () => {
		render({
			setup: () => () => h(Markdown, { nodes: tree }),
		});
		// A screen reader announces "Overview, heading level 2".
		expectExposedAs('heading', 'Overview', { level: 2 });
	});

	it('exposes lists and their items with native list semantics', () => {
		render({
			setup: () => () => h(Markdown, { nodes: tree }),
		});
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
	});

	it('exposes links by their text so SR can list and follow them', () => {
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
									children: [{ type: 'text', value: 'Wire UI' }],
								},
							],
						},
					],
				}),
		});
		const link = expectExposedAs('link', 'Wire UI');
		expect(link).toHaveAttribute('href', 'https://wire-ui.com');
	});

	it('exposes images by their alt text', () => {
		render({
			setup: () => () =>
				h(Markdown, { nodes: [{ type: 'image', url: '/cat.png', alt: 'A sleeping cat' }] }),
		});
		// alt becomes the accessible name; SR announces "A sleeping cat, image".
		expectExposedAs('img', 'A sleeping cat');
	});

	it('exposes a task list item with its checkbox state', () => {
		render({
			setup: () => () =>
				h(Markdown, {
					nodes: [
						{
							type: 'list',
							children: [
								{ type: 'listItem', checked: true, children: [{ type: 'text', value: 'done' }] },
							],
						},
					],
				}),
		});
		const box = screen.getByRole('checkbox');
		expect(box).toBeChecked();
		expect(box).toBeDisabled();
	});
});