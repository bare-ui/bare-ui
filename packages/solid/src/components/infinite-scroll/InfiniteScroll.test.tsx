import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { InfiniteScroll } from './InfiniteScroll';

// --- Mock IntersectionObserver (jsdom has none) ---
let observers: Array<{ cb: IntersectionObserverCallback; el: Element }> = [];

class MockIO {
	cb: IntersectionObserverCallback;
	constructor(cb: IntersectionObserverCallback) {
		this.cb = cb;
	}
	observe(el: Element) {
		observers.push({ cb: this.cb, el });
	}
	unobserve() {}
	disconnect() {
		observers = observers.filter((o) => o.cb !== this.cb);
	}
	takeRecords() {
		return [];
	}
}

function triggerIntersect(isIntersecting: boolean) {
	observers.forEach((o) =>
		o.cb([{ isIntersecting, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver),
	);
}

describe('InfiniteScroll', () => {
	beforeEach(() => {
		observers = [];
		vi.stubGlobal('IntersectionObserver', MockIO);
	});
	afterEach(() => vi.unstubAllGlobals());

	function renderList(props: Partial<Parameters<typeof InfiniteScroll.Root>[0]> = {}) {
		return render(() => (
			<InfiniteScroll.Root
				onLoadMore={() => {}}
				{...props}>
				<div>list</div>
				<InfiniteScroll.Loader>Loading…</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage>The end</InfiniteScroll.EndMessage>
				<InfiniteScroll.Sentinel />
			</InfiniteScroll.Root>
		));
	}

	it('calls onLoadMore when the sentinel intersects', () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore });
		triggerIntersect(true);
		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it('does not call onLoadMore while loading', () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore, loading: true });
		triggerIntersect(true);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not observe when there is nothing more to load', () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore, hasMore: false });
		triggerIntersect(true);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not call onLoadMore when disabled', () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore, disabled: true });
		triggerIntersect(true);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not fire when the sentinel leaves the viewport', () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore });
		triggerIntersect(false);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('shows the loader only while loading', () => {
		const { unmount } = renderList({ loading: false });
		expect(screen.queryByText('Loading…')).toBeNull();
		unmount();
		render(() => (
			<InfiniteScroll.Root
				onLoadMore={() => {}}
				loading>
				<InfiniteScroll.Loader>Loading…</InfiniteScroll.Loader>
			</InfiniteScroll.Root>
		));
		expect(screen.getByText('Loading…')).toBeInTheDocument();
	});

	it('shows the end message only when there is no more', () => {
		const { unmount } = renderList({ hasMore: true });
		expect(screen.queryByText('The end')).toBeNull();
		unmount();
		renderList({ hasMore: false });
		expect(screen.getByText('The end')).toBeInTheDocument();
	});

	it('throws when Sentinel is used outside Root', () => {
		expect(() => render(() => <InfiniteScroll.Sentinel />)).toThrow(/InfiniteScroll.Root/);
	});
});
