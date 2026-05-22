import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

type IntersectionCallback = (
	entries: IntersectionObserverEntry[],
	observer: IntersectionObserver,
) => void;

interface MockIntersectionObserver {
	observe: ReturnType<typeof vi.fn>;
	unobserve: ReturnType<typeof vi.fn>;
	disconnect: ReturnType<typeof vi.fn>;
	takeRecords: ReturnType<typeof vi.fn>;
	__callback: IntersectionCallback;
	__options: IntersectionObserverInit | undefined;
}

const observers = new Set<MockIntersectionObserver>();

beforeEach(() => {
	observers.clear();
	class MockIO {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
		takeRecords = vi.fn(() => [] as IntersectionObserverEntry[]);
		__callback: IntersectionCallback;
		__options: IntersectionObserverInit | undefined;
		root = null;
		rootMargin = '';
		thresholds: ReadonlyArray<number> = [];
		constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
			this.__callback = callback;
			this.__options = options;
			observers.add(this as unknown as MockIntersectionObserver);
		}
	}
	globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
});

afterEach(() => {
	observers.clear();
	vi.restoreAllMocks();
});

function triggerIntersection(target: Element, isIntersecting: boolean, intersectionRatio = isIntersecting ? 1 : 0) {
	const entry = {
		target,
		isIntersecting,
		intersectionRatio,
		boundingClientRect: target.getBoundingClientRect(),
		intersectionRect: target.getBoundingClientRect(),
		rootBounds: null,
		time: performance.now(),
	} as unknown as IntersectionObserverEntry;
	for (const obs of observers) {
		act(() => {
			obs.__callback([entry], obs as unknown as IntersectionObserver);
		});
	}
}

describe('useIntersectionObserver', () => {
	it('returns null before any observation fires', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref);
		});
		expect(result.current).toBeNull();
		document.body.removeChild(el);
	});

	it('observes the target element with provided options', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref, { threshold: 0.5, rootMargin: '10px' });
		});
		expect(observers.size).toBe(1);
		const [obs] = observers;
		expect(obs!.observe).toHaveBeenCalledWith(el);
		expect(obs!.__options?.threshold).toBe(0.5);
		expect(obs!.__options?.rootMargin).toBe('10px');
		document.body.removeChild(el);
	});

	it('updates the returned entry when the observer fires', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref);
		});

		triggerIntersection(el, true);
		expect(result.current).not.toBeNull();
		expect(result.current!.isIntersecting).toBe(true);
		document.body.removeChild(el);
	});

	it('disconnects after first intersection when once is true', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref, { once: true });
		});

		const [obs] = observers;
		triggerIntersection(el, true);
		expect(obs!.disconnect).toHaveBeenCalled();
		expect(result.current!.isIntersecting).toBe(true);
		document.body.removeChild(el);
	});

	it('does not freeze when once is true but not yet intersecting', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref, { once: true });
		});
		const [obs] = observers;

		triggerIntersection(el, false);
		expect(obs!.disconnect).not.toHaveBeenCalled();
		document.body.removeChild(el);
	});

	it('skips observation when enabled is false', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref, { enabled: false });
		});
		expect(observers.size).toBe(0);
		document.body.removeChild(el);
	});

	it('does not observe when ref.current is null', () => {
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(null);
			return useIntersectionObserver(ref);
		});
		expect(observers.size).toBe(0);
	});

	it('disconnects on unmount', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { unmount } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useIntersectionObserver(ref);
		});
		const [obs] = observers;
		unmount();
		expect(obs!.disconnect).toHaveBeenCalled();
		document.body.removeChild(el);
	});
});
