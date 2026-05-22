import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useElementSize } from '@/hooks/use-element-size';

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

describe('useElementSize', () => {
	it('returns zero dimensions before the observer fires', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useElementSize(ref);
		});
		expect(result.current).toEqual({ width: 0, height: 0 });
		document.body.removeChild(el);
	});

	it('subscribes to ResizeObserver on the ref target', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useElementSize(ref);
		});
		expect(observers.size).toBe(1);
		const [obs] = observers;
		expect(obs!.observe).toHaveBeenCalledWith(el);
		document.body.removeChild(el);
	});

	it('reports updated dimensions when the observer fires', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useElementSize(ref);
		});

		triggerResize(el, 320, 240);
		expect(result.current).toEqual({ width: 320, height: 240 });
		document.body.removeChild(el);
	});

	it('does not observe when ref.current is null', () => {
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(null);
			return useElementSize(ref);
		});
		expect(observers.size).toBe(0);
	});

	it('disconnects on unmount', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { unmount } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			return useElementSize(ref);
		});
		const [obs] = observers;
		unmount();
		expect(obs!.disconnect).toHaveBeenCalled();
		document.body.removeChild(el);
	});
});
