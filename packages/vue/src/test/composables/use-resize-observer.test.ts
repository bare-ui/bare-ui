import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useResizeObserver, type ElementSize } from '@/composables/use-resize-observer';

let lastInstance: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> } | null = null;
let lastCallback: ResizeObserverCallback | null = null;

class MockResizeObserver {
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
	constructor(cb: ResizeObserverCallback) {
		lastCallback = cb;
		lastInstance = { observe: this.observe, disconnect: this.disconnect };
	}
}

describe('useResizeObserver', () => {
	const originalObserver = globalThis.ResizeObserver;

	beforeEach(() => {
		lastInstance = null;
		lastCallback = null;
		globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		globalThis.ResizeObserver = originalObserver;
	});

	it('returns an initial size of zero', () => {
		let size!: ElementSize;
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				size = useResizeObserver(el);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		expect(size.width).toBe(0);
		expect(size.height).toBe(0);
	});

	it('updates size when the observer fires', async () => {
		let size!: ElementSize;
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				size = useResizeObserver(el);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		lastCallback?.(
			[{ contentRect: { width: 320, height: 240 } } as ResizeObserverEntry],
			lastInstance as unknown as ResizeObserver,
		);
		expect(size.width).toBe(320);
		expect(size.height).toBe(240);
	});

	it('invokes onResize with the new size and entry', async () => {
		const onResize = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useResizeObserver(el, onResize);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		const entry = { contentRect: { width: 100, height: 50 } } as ResizeObserverEntry;
		lastCallback?.([entry], lastInstance as unknown as ResizeObserver);
		expect(onResize).toHaveBeenCalledWith({ width: 100, height: 50 }, entry);
	});

	it('disconnects on unmount', async () => {
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useResizeObserver(el);
				return () => h('div', { ref: el });
			},
		});
		const { unmount } = render(Harness);
		await nextTick();
		const captured = lastInstance;
		unmount();
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('does not observe when target is null', async () => {
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useResizeObserver(el);
				return () => h('div');
			},
		});
		render(Harness);
		await nextTick();
		expect(lastInstance).toBeNull();
	});
});
