import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref, type Ref } from 'vue';
import { useIntersectionObserver } from '@/composables/use-intersection-observer';

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
	observe: ReturnType<typeof vi.fn>;
	unobserve: ReturnType<typeof vi.fn>;
	disconnect: ReturnType<typeof vi.fn>;
	takeRecords: ReturnType<typeof vi.fn>;
	options?: IntersectionObserverInit;
	constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
		lastCallback = cb;
		this.observe = vi.fn();
		this.unobserve = vi.fn();
		this.disconnect = vi.fn();
		this.takeRecords = vi.fn(() => []);
		this.options = opts;
		lastInstance = { observe: this.observe, disconnect: this.disconnect, options: opts };
	}
}

describe('useIntersectionObserver', () => {
	const originalObserver = globalThis.IntersectionObserver;

	beforeEach(() => {
		lastInstance = null;
		lastCallback = null;
		globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
	});

	afterEach(() => {
		globalThis.IntersectionObserver = originalObserver;
	});

	it('returns null entry initially', () => {
		let entry!: Ref<IntersectionObserverEntry | null>;
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				entry = useIntersectionObserver(el);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		expect(entry.value).toBeNull();
	});

	it('updates entry when the observer fires', async () => {
		let entry!: Ref<IntersectionObserverEntry | null>;
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				entry = useIntersectionObserver(el);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		const observed = { isIntersecting: true } as IntersectionObserverEntry;
		lastCallback?.([observed], {} as IntersectionObserver);
		expect(entry.value?.isIntersecting).toBe(true);
	});

	it('passes options through to the observer constructor', async () => {
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useIntersectionObserver(el, { rootMargin: '20px', threshold: 0.5 });
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		expect(lastInstance?.options).toMatchObject({ rootMargin: '20px', threshold: 0.5 });
	});

	it('disconnects on unmount', async () => {
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useIntersectionObserver(el);
				return () => h('div', { ref: el });
			},
		});
		const { unmount } = render(Harness);
		await nextTick();
		const captured = lastInstance;
		unmount();
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('stops observing after the first intersection when once is true', async () => {
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useIntersectionObserver(el, { once: true });
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		const captured = lastInstance;
		lastCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('respects the enabled option', async () => {
		const enabled = ref(false);
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useIntersectionObserver(el, { enabled });
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		expect(lastInstance).toBeNull();
		enabled.value = true;
		await nextTick();
		expect(lastInstance?.observe).toHaveBeenCalled();
	});
});
