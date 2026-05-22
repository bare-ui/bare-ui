import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useElementSize } from '@/composables/use-element-size';
import type { ElementSize } from '@/composables/use-resize-observer';

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

describe('useElementSize', () => {
	const originalResizeObserver = globalThis.ResizeObserver;

	beforeEach(() => {
		lastCallback = null;
		lastInstance = null;
		globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		globalThis.ResizeObserver = originalResizeObserver;
	});

	it('returns initial size of {width: 0, height: 0}', () => {
		let size!: ElementSize;
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				size = useElementSize(el);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		expect(size.width).toBe(0);
		expect(size.height).toBe(0);
	});

	it('updates when the observer fires', async () => {
		let size!: ElementSize;
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				size = useElementSize(el);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		expect(lastCallback).not.toBeNull();
		lastCallback?.(
			[{ contentRect: { width: 200, height: 100 } } as ResizeObserverEntry],
			lastInstance as unknown as ResizeObserver,
		);
		expect(size.width).toBe(200);
		expect(size.height).toBe(100);
	});

	it('disconnects on unmount', async () => {
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useElementSize(el);
				return () => h('div', { ref: el });
			},
		});
		const { unmount } = render(Harness);
		await nextTick();
		const captured = lastInstance;
		unmount();
		expect(captured?.disconnect).toHaveBeenCalled();
	});
});
