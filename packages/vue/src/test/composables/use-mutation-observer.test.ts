import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useMutationObserver } from '@/composables/use-mutation-observer';

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

describe('useMutationObserver', () => {
	const originalObserver = globalThis.MutationObserver;

	beforeEach(() => {
		lastInstance = null;
		lastCallback = null;
		globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;
	});

	afterEach(() => {
		globalThis.MutationObserver = originalObserver;
	});

	it('observes the target when ref resolves', async () => {
		const cb = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useMutationObserver(el, cb);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		expect(lastInstance?.observe).toHaveBeenCalledTimes(1);
	});

	it('calls the user callback when the observer fires', async () => {
		const cb = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useMutationObserver(el, cb);
				return () => h('div', { ref: el });
			},
		});
		render(Harness);
		await nextTick();
		const records = [] as unknown as MutationRecord[];
		lastCallback?.(records, lastInstance as unknown as MutationObserver);
		expect(cb).toHaveBeenCalledWith(records, lastInstance);
	});

	it('disconnects on unmount', async () => {
		const cb = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useMutationObserver(el, cb);
				return () => h('div', { ref: el });
			},
		});
		const { unmount } = render(Harness);
		await nextTick();
		const captured = lastInstance;
		unmount();
		expect(captured?.disconnect).toHaveBeenCalled();
	});

	it('does not observe when target ref is null', async () => {
		const cb = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useMutationObserver(el, cb);
				return () => h('div');
			},
		});
		render(Harness);
		await nextTick();
		expect(lastInstance).toBeNull();
	});

	it('respects the enabled option', async () => {
		const cb = vi.fn();
		const enabled = ref(false);
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLDivElement | null>(null);
				useMutationObserver(el, cb, { enabled });
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
