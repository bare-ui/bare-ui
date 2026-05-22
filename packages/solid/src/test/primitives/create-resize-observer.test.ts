import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createResizeObserver, type ElementSize } from '@/primitives/create-resize-observer';

let lastCallback: ResizeObserverCallback | null = null;
let lastInstance: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> } | null = null;

class MockResizeObserver {
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
	constructor(cb: ResizeObserverCallback) {
		lastCallback = cb;
		lastInstance = { observe: this.observe, disconnect: this.disconnect };
	}
}

describe('createResizeObserver', () => {
	const original = globalThis.ResizeObserver;

	beforeEach(() => {
		lastCallback = null;
		lastInstance = null;
		globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		globalThis.ResizeObserver = original;
	});

	it('returns an initial size of zero', () => {
		const el = document.createElement('div');
		const { result, cleanup } = renderHook(() => createResizeObserver(() => el));
		expect(result()).toEqual({ width: 0, height: 0 });
		cleanup();
	});

	it('updates size when the observer fires', () => {
		const el = document.createElement('div');
		const { result, cleanup } = renderHook(() => createResizeObserver(() => el));
		lastCallback?.(
			[{ contentRect: { width: 320, height: 240 } } as ResizeObserverEntry],
			lastInstance as unknown as ResizeObserver,
		);
		expect(result()).toEqual({ width: 320, height: 240 });
		cleanup();
	});

	it('invokes onResize with the new size and entry', () => {
		const el = document.createElement('div');
		const onResize = vi.fn();
		const { cleanup } = renderHook(() => createResizeObserver(() => el, onResize));
		const entry = { contentRect: { width: 100, height: 50 } } as ResizeObserverEntry;
		lastCallback?.([entry], lastInstance as unknown as ResizeObserver);
		expect(onResize).toHaveBeenCalledWith({ width: 100, height: 50 }, entry);
		cleanup();
	});

	it('disconnects on cleanup', () => {
		const el = document.createElement('div');
		const { cleanup } = renderHook(() => createResizeObserver(() => el));
		const captured = lastInstance;
		cleanup();
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('does not observe when target is null', () => {
		const { cleanup } = renderHook(() => createResizeObserver(() => null));
		expect(lastInstance).toBeNull();
		cleanup();
	});

	it('reattaches when target accessor changes', () => {
		const a = document.createElement('div');
		const b = document.createElement('div');
		const [target, setTarget] = createSignal<HTMLDivElement | null>(a);
		const { cleanup } = renderHook(() => createResizeObserver(target));
		const first = lastInstance;
		setTarget(b);
		expect(first?.disconnect).toHaveBeenCalled();
		expect(lastInstance).not.toBe(first);
		cleanup();
		expect(({ width: 0, height: 0 } as ElementSize).width).toBe(0);
	});
});
