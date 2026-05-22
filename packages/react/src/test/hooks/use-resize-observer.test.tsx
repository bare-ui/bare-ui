import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useResizeObserver } from '@/hooks/use-resize-observer';

type ResizeCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface MockResizeObserver {
	observe: ReturnType<typeof vi.fn>;
	unobserve: ReturnType<typeof vi.fn>;
	disconnect: ReturnType<typeof vi.fn>;
	__callback: ResizeCallback;
}

const observers = new Set<MockResizeObserver>();

beforeEach(() => {
	observers.clear();
	class MockRO {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
		__callback: ResizeCallback;
		constructor(callback: ResizeCallback) {
			this.__callback = callback;
			observers.add(this as unknown as MockResizeObserver);
		}
	}
	globalThis.ResizeObserver = MockRO as unknown as typeof ResizeObserver;
});

afterEach(() => {
	observers.clear();
	vi.restoreAllMocks();
});

function triggerResize(target: Element, width: number, height: number) {
	const entry = {
		target,
		contentRect: { width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0 },
		borderBoxSize: [],
		contentBoxSize: [],
		devicePixelContentBoxSize: [],
	} as unknown as ResizeObserverEntry;
	for (const obs of observers) {
		act(() => {
			obs.__callback([entry], obs as unknown as ResizeObserver);
		});
	}
}

describe('useResizeObserver', () => {
	it('returns zero dimensions initially', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useResizeObserver(ref);
		});
		expect(result.current).toEqual({ width: 0, height: 0 });
		document.body.removeChild(el);
	});

	it('observes the target element via ResizeObserver', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useResizeObserver(ref);
		});
		expect(observers.size).toBe(1);
		const [obs] = observers;
		expect(obs!.observe).toHaveBeenCalledWith(el);
		document.body.removeChild(el);
	});

	it('updates size when ResizeObserver fires', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useResizeObserver(ref);
		});

		triggerResize(el, 200, 100);
		expect(result.current).toEqual({ width: 200, height: 100 });
		document.body.removeChild(el);
	});

	it('invokes the onResize callback with the latest size and entry', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const onResize = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useResizeObserver(ref, onResize);
		});

		triggerResize(el, 50, 25);
		expect(onResize).toHaveBeenCalledTimes(1);
		expect(onResize).toHaveBeenCalledWith({ width: 50, height: 25 }, expect.any(Object));
		document.body.removeChild(el);
	});

	it('does nothing when ref.current is null', () => {
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(null);
			return useResizeObserver(ref);
		});
		expect(observers.size).toBe(0);
	});

	it('disconnects observer on unmount', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { unmount } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useResizeObserver(ref);
		});
		const [obs] = observers;
		unmount();
		expect(obs!.disconnect).toHaveBeenCalled();
		document.body.removeChild(el);
	});

	it('returns the same size object reference when dimensions are unchanged', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useResizeObserver(ref);
		});

		triggerResize(el, 100, 50);
		const first = result.current;
		triggerResize(el, 100, 50);
		expect(result.current).toBe(first);
		document.body.removeChild(el);
	});
});
