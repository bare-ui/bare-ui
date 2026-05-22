import { renderHook } from '@solidjs/testing-library';
import { createElementSize } from '@/primitives/create-element-size';

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

describe('createElementSize', () => {
	const original = globalThis.ResizeObserver;

	beforeEach(() => {
		lastCallback = null;
		lastInstance = null;
		globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		globalThis.ResizeObserver = original;
	});

	it('returns initial {width: 0, height: 0}', () => {
		const el = document.createElement('div');
		const { result, cleanup } = renderHook(() => createElementSize(() => el));
		expect(result()).toEqual({ width: 0, height: 0 });
		cleanup();
	});

	it('updates when the underlying ResizeObserver fires', () => {
		const el = document.createElement('div');
		const { result, cleanup } = renderHook(() => createElementSize(() => el));
		lastCallback?.(
			[{ contentRect: { width: 200, height: 100 } } as ResizeObserverEntry],
			lastInstance as unknown as ResizeObserver,
		);
		expect(result()).toEqual({ width: 200, height: 100 });
		cleanup();
	});

	it('disconnects on cleanup', () => {
		const el = document.createElement('div');
		const { cleanup } = renderHook(() => createElementSize(() => el));
		const captured = lastInstance;
		cleanup();
		expect(captured?.disconnect).toHaveBeenCalled();
	});
});
