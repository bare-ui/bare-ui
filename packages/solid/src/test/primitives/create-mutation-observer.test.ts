import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createMutationObserver } from '@/primitives/create-mutation-observer';

let lastInstance: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> } | null = null;
let lastCallback: MutationCallback | null = null;

class MockMutationObserver {
	observe = vi.fn();
	disconnect = vi.fn();
	takeRecords = vi.fn(() => []);
	constructor(cb: MutationCallback) {
		lastCallback = cb;
		lastInstance = { observe: this.observe, disconnect: this.disconnect };
	}
}

describe('createMutationObserver', () => {
	const original = globalThis.MutationObserver;

	beforeEach(() => {
		lastInstance = null;
		lastCallback = null;
		globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;
	});

	afterEach(() => {
		globalThis.MutationObserver = original;
	});

	it('observes the target when accessor resolves', () => {
		const el = document.createElement('div');
		const cb = vi.fn();
		const { cleanup } = renderHook(() => createMutationObserver(() => el, cb));
		expect(lastInstance?.observe).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('calls the user callback when the observer fires', () => {
		const el = document.createElement('div');
		const cb = vi.fn();
		const { cleanup } = renderHook(() => createMutationObserver(() => el, cb));
		const records = [] as unknown as MutationRecord[];
		lastCallback?.(records, lastInstance as unknown as MutationObserver);
		expect(cb).toHaveBeenCalledWith(records, lastInstance);
		cleanup();
	});

	it('disconnects on cleanup', () => {
		const el = document.createElement('div');
		const cb = vi.fn();
		const { cleanup } = renderHook(() => createMutationObserver(() => el, cb));
		const captured = lastInstance;
		cleanup();
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('does not observe when target is null', () => {
		const cb = vi.fn();
		const { cleanup } = renderHook(() => createMutationObserver(() => null, cb));
		expect(lastInstance).toBeNull();
		cleanup();
	});

	it('respects the enabled option (reactive via getter)', () => {
		const el = document.createElement('div');
		const [enabled, setEnabled] = createSignal(false);
		const cb = vi.fn();
		const { cleanup } = renderHook(() =>
			createMutationObserver(() => el, cb, {
				get enabled() {
					return enabled();
				},
			}),
		);
		expect(lastInstance).toBeNull();
		setEnabled(true);
		expect(lastInstance?.observe).toHaveBeenCalled();
		cleanup();
	});
});
