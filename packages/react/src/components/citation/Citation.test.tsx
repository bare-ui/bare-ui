import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Citation } from './Citation';
import type { CitationSource } from './Citation.types';

const sources: CitationSource[] = [
	{ id: 'a', title: 'First source', url: 'https://example.com/a' },
	{ id: 'b', title: 'Second source', url: 'https://example.com/b' },
];

function renderCitation() {
	return render(
		<Citation.Root sources={sources}>
			<p>
				Claim one
				<Citation.Ref for='a' />, and claim two
				<Citation.Ref for='b' />.
			</p>
			<Citation.List />
		</Citation.Root>,
	);
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

	it('honors a label override on the marker', () => {
		render(
			<Citation.Root sources={[{ id: 'x', label: '*', title: 'Note' }]}>
				<Citation.Ref for='x' />
			</Citation.Root>,
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('renders nothing for an unknown source id', () => {
		const { container } = render(
			<Citation.Root sources={sources}>
				<Citation.Ref
					for='missing'
					data-testid='ghost'
				/>
			</Citation.Root>,
		);
		expect(container.querySelector('[data-testid="ghost"]')).toBeNull();
	});

	it('supports a custom marker render function', () => {
		render(
			<Citation.Root sources={sources}>
				<Citation.Ref for='b'>{({ index, source }) => <span>{`[${index}:${source.title}]`}</span>}</Citation.Ref>
			</Citation.Root>,
		);
		expect(screen.getByText('[2:Second source]')).toBeInTheDocument();
	});

	it('supports a custom footnote render function', () => {
		render(
			<Citation.Root sources={sources}>
				<Citation.List>{({ index, source }) => <span>{`${index} — ${source.id}`}</span>}</Citation.List>
			</Citation.Root>,
		);
		expect(screen.getByText('1 — a')).toBeInTheDocument();
		expect(screen.getByText('2 — b')).toBeInTheDocument();
	});

	it('throws when Ref is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Citation.Ref for='a' />)).toThrow(/Citation.Root/);
		spy.mockRestore();
	});

	it('renders an unsafe source URL as plain text instead of a link', () => {
		render(
			<Citation.Root sources={[{ id: 'x', title: 'Evil', url: 'javascript:alert(1)' }]}>
				<Citation.List />
			</Citation.Root>,
		);
		// No anchor is rendered for the malicious URL; the title shows as text.
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.getByText('Evil')).toBeInTheDocument();
	});
});
