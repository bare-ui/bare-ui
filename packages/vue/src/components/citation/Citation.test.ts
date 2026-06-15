import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Citation } from '.';
import type { CitationSource, CitationRenderProps } from './Citation.types';

const sources: CitationSource[] = [
	{ id: 'a', title: 'First source', url: 'https://example.com/a' },
	{ id: 'b', title: 'Second source', url: 'https://example.com/b' },
];

function renderCitation() {
	return render({
		setup() {
			return () =>
				h(Citation.Root, { sources }, () => [
					h('p', null, [
						'Claim one',
						h(Citation.Ref, { for: 'a' }),
						', and claim two',
						h(Citation.Ref, { for: 'b' }),
						'.',
					]),
					h(Citation.List),
				]);
		},
	});
}

describe('Citation', () => {
	it('numbers references by source order', () => {
		const { container } = renderCitation();
		const refs = container.querySelectorAll('[data-citation]');
		expect(refs).toHaveLength(2);
		expect(refs[0]).toHaveTextContent('1');
		expect(refs[1]).toHaveTextContent('2');
	});

	it('links a reference to its footnote via href + id', () => {
		const { container } = renderCitation();
		const ref = container.querySelector('[data-citation][data-index="1"]') as HTMLAnchorElement;
		const footnote = container.querySelector('[data-citation-source][data-index="1"]') as HTMLElement;
		expect(ref.getAttribute('href')).toBe(`#${footnote.id}`);
		expect(ref).toHaveAttribute('aria-describedby', footnote.id);
	});

	it('renders the footnote list with titles and links', () => {
		renderCitation();
		const list = screen.getByRole('list');
		expect(list).toHaveTextContent('First source');
		expect(screen.getByRole('link', { name: 'First source' })).toHaveAttribute(
			'href',
			'https://example.com/a',
		);
	});

	it('sanitizes a dangerous footnote URL, falling back to plain text', () => {
		const { container } = render({
			setup() {
				return () =>
					h(
						Citation.Root,
						{ sources: [{ id: 'evil', title: 'Click me', url: 'javascript:alert(1)' }] },
						() => [h(Citation.List)],
					);
			},
		});
		// No anchor is rendered for the unsafe scheme; the title shows as text.
		expect(container.querySelector('[data-citation-source] a')).toBeNull();
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('honors a label override on the marker', () => {
		render({
			setup() {
				return () =>
					h(Citation.Root, { sources: [{ id: 'x', label: '*', title: 'Note' }] }, () => [
						h(Citation.Ref, { for: 'x' }),
					]);
			},
		});
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('renders nothing for an unknown source id', () => {
		const { container } = render({
			setup() {
				return () =>
					h(Citation.Root, { sources }, () => [
						h(Citation.Ref, { for: 'missing', 'data-testid': 'ghost' }),
					]);
			},
		});
		expect(container.querySelector('[data-testid="ghost"]')).toBeNull();
	});

	it('supports a custom marker via scoped slot', () => {
		render({
			setup() {
				return () =>
					h(Citation.Root, { sources }, () => [
						h(
							Citation.Ref,
							{ for: 'b' },
							({ index, source }: CitationRenderProps) =>
								h('span', null, `[${index}:${source.title}]`),
						),
					]);
			},
		});
		expect(screen.getByText('[2:Second source]')).toBeInTheDocument();
	});

	it('supports a custom footnote via scoped slot', () => {
		render({
			setup() {
				return () =>
					h(Citation.Root, { sources }, () => [
						h(
							Citation.List,
							null,
							({ index, source }: CitationRenderProps) =>
								h('span', null, `${index} — ${source.id}`),
						),
					]);
			},
		});
		expect(screen.getByText('1 — a')).toBeInTheDocument();
		expect(screen.getByText('2 — b')).toBeInTheDocument();
	});

	it('throws when Ref is used outside Root', () => {
		expect(() =>
			render({
				setup() {
					return () => h(Citation.Ref, { for: 'a' });
				},
			}),
		).toThrow(/Citation.Root/);
	});
});
