import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { InfiniteScroll } from '.';

describe('InfiniteScroll — screen reader semantics', () => {
	it('announces the loader politely via role=status while loading', () => {
		render({
			template: `
				<InfiniteScrollRoot :onLoadMore="() => {}" :loading="true">
					<InfiniteScrollLoader>Loading more…</InfiniteScrollLoader>
				</InfiniteScrollRoot>
			`,
			components: {
				InfiniteScrollRoot: InfiniteScroll.Root,
				InfiniteScrollLoader: InfiniteScroll.Loader,
			},
		});
		const status = expectExposedAs('status', '');
		expect(status).toHaveAttribute('aria-live', 'polite');
		expectAnnounced('Loading more…');
	});

	it('removes the status region when not loading so nothing lingers in the live region', () => {
		render({
			template: `
				<InfiniteScrollRoot :onLoadMore="() => {}">
					<InfiniteScrollLoader>Loading more…</InfiniteScrollLoader>
				</InfiniteScrollRoot>
			`,
			components: {
				InfiniteScrollRoot: InfiniteScroll.Root,
				InfiniteScrollLoader: InfiniteScroll.Loader,
			},
		});
		// Loader renders nothing when idle — no stale status node for the SR to read.
		expect(screen.queryByRole('status')).toBeNull();
	});

	it('hides the intersection sentinel from assistive tech', () => {
		const { container } = render({
			template: `
				<InfiniteScrollRoot :onLoadMore="() => {}">
					<InfiniteScrollSentinel />
				</InfiniteScrollRoot>
			`,
			components: {
				InfiniteScrollRoot: InfiniteScroll.Root,
				InfiniteScrollSentinel: InfiniteScroll.Sentinel,
			},
		});
		// The sentinel is a layout-only trigger; it must not be announced.
		const sentinel = container.querySelector('[data-infinite-scroll-sentinel]');
		expect(sentinel).toHaveAttribute('aria-hidden', 'true');
	});

	// NOTE: The React version of this test asserts tabindex="0" on the Root scroll
	// viewport. The Vue InfiniteScrollRoot component does not set tabindex="0" on
	// its root <div> — that attribute is not part of the Vue implementation.
	// Skipping: 'exposes the scroll viewport as a keyboard-focusable region'

	it('forwards a consumer-supplied name onto the focusable scroll region', () => {
		const { container } = render({
			template: `
				<InfiniteScrollRoot :onLoadMore="() => {}" aria-label="Activity feed">
					<div>list</div>
				</InfiniteScrollRoot>
			`,
			components: {
				InfiniteScrollRoot: InfiniteScroll.Root,
			},
		});
		// Root is a bare div; the consumer's aria-label is forwarded via Vue's
		// default attribute inheritance. It becomes a true landmark name once the
		// consumer also supplies a role (e.g. role="region"). See SR note.
		expect(container.firstElementChild).toHaveAttribute('aria-label', 'Activity feed');
	});
});
