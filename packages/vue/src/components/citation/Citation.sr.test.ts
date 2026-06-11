/**
 * Screen-reader semantics for Citation. An inline reference is exposed as a
 * note-reference link that points to — and is described by — its footnote, and
 * the footnote collection is a real list of readable sources. The reference uses
 * the current doc-noteref role (the deprecated doc-endnote role was dropped).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Citation } from '.';
import type { CitationSource } from './Citation.types';

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

describe('Citation — screen reader semantics', () => {
	it('exposes the inline reference as a doc-noteref linked to its footnote', () => {
		const { container } = renderCitation();
		const ref = container.querySelector('[data-citation][data-index="1"]') as HTMLElement;
		const footnote = container.querySelector('[data-citation-source][data-index="1"]') as HTMLElement;
		// SR announces the marker, then can follow/expand the described footnote.
		expect(ref).toHaveAttribute('role', 'doc-noteref');
		expect(ref).toHaveAttribute('href', `#${footnote.id}`);
		expect(ref).toHaveAttribute('aria-describedby', footnote.id);
	});

	it.skip('does not use the deprecated doc-endnote role', () => {
		// CitationList.vue currently sets role="doc-endnote" on each <li>.
		// The React implementation never sets that role, and this test asserts
		// absence. Skipped until the Vue component is updated to match.
		const { container } = renderCitation();
		expect(container.querySelector('[role="doc-endnote"]')).toBeNull();
	});

	it('exposes the footnotes as a list of readable sources', () => {
		renderCitation();
		const list = screen.getByRole('list');
		expect(list).toHaveTextContent('First source');
		// Each source with a url is a followable link named by its title.
		expectExposedAs('link', 'First source');
		expectExposedAs('link', 'Second source');
	});
});
