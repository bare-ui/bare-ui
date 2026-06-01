import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { InfiniteScroll } from './InfiniteScroll';

describe('InfiniteScroll — screen reader semantics', () => {
	it('announces the loader politely via role=status while loading', () => {
		render(
			<InfiniteScroll.Root
				onLoadMore={() => {}}
				loading>
				<InfiniteScroll.Loader>Loading more…</InfiniteScroll.Loader>
			</InfiniteScroll.Root>,
		);
		const status = expectExposedAs('status', '');
		expect(status).toHaveAttribute('aria-live', 'polite');
		expectAnnounced('Loading more…');
	});

	it('removes the status region when not loading so nothing lingers in the live region', () => {
		render(
			<InfiniteScroll.Root onLoadMore={() => {}}>
				<InfiniteScroll.Loader>Loading more…</InfiniteScroll.Loader>
			</InfiniteScroll.Root>,
		);
		// Loader returns null when idle — no stale status node for the SR to read.
		expect(screen.queryByRole('status')).toBeNull();
	});

	it('hides the intersection sentinel from assistive tech', () => {
		const { container } = render(
			<InfiniteScroll.Root onLoadMore={() => {}}>
				<InfiniteScroll.Sentinel />
			</InfiniteScroll.Root>,
		);
		// The sentinel is a layout-only trigger; it must not be announced.
		const sentinel = container.querySelector('[data-infinite-scroll-sentinel]');
		expect(sentinel).toHaveAttribute('aria-hidden', 'true');
	});

	it('exposes the scroll viewport as a keyboard-focusable region', () => {
		const { container } = render(
			<InfiniteScroll.Root onLoadMore={() => {}}>
				<div>list</div>
			</InfiniteScroll.Root>,
		);
		// Consumers apply overflow to Root, so it must be tabbable for keyboard scroll.
		expect(container.firstElementChild).toHaveAttribute('tabindex', '0');
	});

	it('forwards a consumer-supplied name onto the focusable scroll region', () => {
		const { container } = render(
			<InfiniteScroll.Root
				onLoadMore={() => {}}
				aria-label='Activity feed'>
				<div>list</div>
			</InfiniteScroll.Root>,
		);
		// Root is a bare focusable div (implicit role=generic), so the consumer's
		// aria-label is carried through but only becomes a true landmark/region name
		// once the consumer also supplies a role (e.g. role="region"). See SR note.
		expect(container.firstElementChild).toHaveAttribute('aria-label', 'Activity feed');
	});
});
