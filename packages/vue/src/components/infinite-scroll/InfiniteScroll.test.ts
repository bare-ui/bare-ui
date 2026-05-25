import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { InfiniteScroll } from '.';

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
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

async function triggerIntersect(isIntersecting: boolean) {
	observers.forEach((o) =>
		o.cb([{ isIntersecting, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver),
	);
	await nextTick();
	await nextTick();
}

describe('InfiniteScroll', () => {
	beforeEach(() => {
		observers = [];
		vi.stubGlobal('IntersectionObserver', MockIO);
	});
	afterEach(() => vi.unstubAllGlobals());

	function renderList(props: Record<string, unknown> = {}) {
		return render({
			setup() {
				return () =>
					h(
						InfiniteScroll.Root,
						{ onLoadMore: () => {}, ...props },
						() => [
							h('div', null, 'list'),
							h(InfiniteScroll.Loader, null, () => 'Loading…'),
							h(InfiniteScroll.EndMessage, null, () => 'The end'),
							h(InfiniteScroll.Sentinel),
						],
					);
			},
		});
	}

	it('calls onLoadMore when the sentinel intersects', async () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore });
		await nextTick();
		await triggerIntersect(true);
		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it('does not call onLoadMore while loading', async () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore, loading: true });
		await nextTick();
		await triggerIntersect(true);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not observe when there is nothing more to load', async () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore, hasMore: false });
		await nextTick();
		await triggerIntersect(true);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not call onLoadMore when disabled', async () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore, disabled: true });
		await nextTick();
		await triggerIntersect(true);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not fire when the sentinel leaves the viewport', async () => {
		const onLoadMore = vi.fn();
		renderList({ onLoadMore });
		await nextTick();
		await triggerIntersect(false);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('shows the loader only while loading', async () => {
		// not loading => loader hidden
		render({
			setup() {
				return () =>
					h(
						InfiniteScroll.Root,
						{ onLoadMore: () => {}, loading: false },
						() => [h(InfiniteScroll.Loader, null, () => 'Loading…')],
					);
			},
		});
		await nextTick();
		expect(screen.queryByText('Loading…')).toBeNull();

		// loading => loader visible
		render({
			setup() {
				return () =>
					h(
						InfiniteScroll.Root,
						{ onLoadMore: () => {}, loading: true },
						() => [h(InfiniteScroll.Loader, null, () => 'Loading…')],
					);
			},
		});
		await nextTick();
		expect(screen.getByText('Loading…')).toBeInTheDocument();
	});

	it('shows the end message only when there is no more', async () => {
		renderList({ hasMore: true });
		await nextTick();
		expect(screen.queryByText('The end')).toBeNull();

		render({
			setup() {
				return () =>
					h(
						InfiniteScroll.Root,
						{ onLoadMore: () => {}, hasMore: false },
						() => [h(InfiniteScroll.EndMessage, null, () => 'The end')],
					);
			},
		});
		await nextTick();
		expect(screen.getByText('The end')).toBeInTheDocument();
	});

	it('throws when Sentinel is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () => h(InfiniteScroll.Sentinel);
				},
			}),
		).toThrow(/InfiniteScroll.Root/);
		spy.mockRestore();
	});

	it('root has data-loading when loading', async () => {
		const { container } = renderList({ loading: true });
		await nextTick();
		expect(container.firstChild).toHaveAttribute('data-loading', '');
	});

	it('root has data-has-more when hasMore', async () => {
		const { container } = renderList({ hasMore: true });
		await nextTick();
		expect(container.firstChild).toHaveAttribute('data-has-more', '');
	});

	it('root does not have data-has-more when no more', async () => {
		const { container } = renderList({ hasMore: false });
		await nextTick();
		expect(container.firstChild).not.toHaveAttribute('data-has-more');
	});

	it('sentinel has aria-hidden and data-infinite-scroll-sentinel', async () => {
		renderList();
		await nextTick();
		const sentinel = document.querySelector('[data-infinite-scroll-sentinel]');
		expect(sentinel).toBeInTheDocument();
		expect(sentinel).toHaveAttribute('aria-hidden', 'true');
	});

	it('loader has role=status and aria-live=polite', async () => {
		renderList({ loading: true });
		await nextTick();
		const loader = screen.getByRole('status');
		expect(loader).toHaveAttribute('aria-live', 'polite');
	});
});
