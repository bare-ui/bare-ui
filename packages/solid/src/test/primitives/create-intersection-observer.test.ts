import { renderHook } from '@solidjs/testing-library';
import { createIntersectionObserver } from '@/primitives/create-intersection-observer';

let lastInstance: {
	observe: ReturnType<typeof vi.fn>;
	disconnect: ReturnType<typeof vi.fn>;
	options: IntersectionObserverInit | undefined;
} | null = null;
let lastCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
	root = null;
	rootMargin = '';
	thresholds: number[] = [];
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	takeRecords = vi.fn(() => []);
	options?: IntersectionObserverInit;
	constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
		lastCallback = cb;
		this.options = opts;
		lastInstance = { observe: this.observe, disconnect: this.disconnect, options: opts };
	}
}

describe('createIntersectionObserver', () => {
	const original = globalThis.IntersectionObserver;

	beforeEach(() => {
		lastInstance = null;
		lastCallback = null;
		globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
	});

	afterEach(() => {
		globalThis.IntersectionObserver = original;
	});

	it('returns null entry initially', () => {
		const el = document.createElement('div');
		const { result, cleanup } = renderHook(() => createIntersectionObserver(() => el));
		expect(result()).toBeNull();
		cleanup();
	});

	it('updates entry when the observer fires', () => {
		const el = document.createElement('div');
		const { result, cleanup } = renderHook(() => createIntersectionObserver(() => el));
		const entry = { isIntersecting: true } as IntersectionObserverEntry;
		lastCallback?.([entry], {} as IntersectionObserver);
		expect(result()?.isIntersecting).toBe(true);
		cleanup();
	});

	it('passes options through to the observer constructor', () => {
		const el = document.createElement('div');
		const { cleanup } = renderHook(() =>
			createIntersectionObserver(() => el, { rootMargin: '20px', threshold: 0.5 }),
		);
		expect(lastInstance?.options).toMatchObject({ rootMargin: '20px', threshold: 0.5 });
		cleanup();
	});

	it('disconnects on cleanup', () => {
		const el = document.createElement('div');
		const { cleanup } = renderHook(() => createIntersectionObserver(() => el));
		const captured = lastInstance;
		cleanup();
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('stops observing after the first intersection when once is true', () => {
		const el = document.createElement('div');
		const { cleanup } = renderHook(() => createIntersectionObserver(() => el, { once: true }));
		const captured = lastInstance;
		lastCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
		expect(captured?.disconnect).toHaveBeenCalled();
		cleanup();
	});

	it('does not observe when enabled is false', () => {
		const el = document.createElement('div');
		const { cleanup } = renderHook(() => createIntersectionObserver(() => el, { enabled: false }));
		expect(lastInstance).toBeNull();
		cleanup();
	});
});
