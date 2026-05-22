import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref, type Ref } from 'vue';
import { useDebounce, useDebouncedCallback } from '@/composables/use-debounce';

describe('useDebounce', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('returns the initial value synchronously', () => {
		let debounced!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				const source = ref(1);
				debounced = useDebounce(source, 100);
				return () => h('div');
			},
		});
		render(Harness);
		expect(debounced.value).toBe(1);
	});

	it('does not update before the delay has elapsed', async () => {
		let debounced!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(1);
				debounced = useDebounce(source, 100);
				return () => h('div');
			},
		});
		render(Harness);
		source.value = 2;
		await nextTick();
		vi.advanceTimersByTime(50);
		expect(debounced.value).toBe(1);
	});

	it('updates after the delay', async () => {
		let debounced!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(1);
				debounced = useDebounce(source, 100);
				return () => h('div');
			},
		});
		render(Harness);
		source.value = 2;
		await nextTick();
		vi.advanceTimersByTime(100);
		expect(debounced.value).toBe(2);
	});

	it('coalesces rapid changes — only the last value emits', async () => {
		let debounced!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(0);
				debounced = useDebounce(source, 100);
				return () => h('div');
			},
		});
		render(Harness);
		source.value = 1;
		await nextTick();
		vi.advanceTimersByTime(50);
		source.value = 2;
		await nextTick();
		vi.advanceTimersByTime(50);
		source.value = 3;
		await nextTick();
		expect(debounced.value).toBe(0);
		vi.advanceTimersByTime(100);
		expect(debounced.value).toBe(3);
	});

	it('clears the timer on unmount', async () => {
		let debounced!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(1);
				debounced = useDebounce(source, 100);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		source.value = 2;
		await nextTick();
		unmount();
		vi.advanceTimersByTime(200);
		expect(debounced.value).toBe(1);
	});
});

describe('useDebouncedCallback', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not invoke the callback before the delay', () => {
		const cb = vi.fn();
		let debounced!: (n: number) => void;
		const Harness = defineComponent({
			setup() {
				debounced = useDebouncedCallback(cb, 100);
				return () => h('div');
			},
		});
		render(Harness);
		debounced(1);
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(50);
		expect(cb).toHaveBeenCalledWith(1);
	});

	it('coalesces rapid calls — only the last args are used', () => {
		const cb = vi.fn();
		let debounced!: (n: number) => void;
		const Harness = defineComponent({
			setup() {
				debounced = useDebouncedCallback(cb, 100);
				return () => h('div');
			},
		});
		render(Harness);
		debounced(1);
		debounced(2);
		debounced(3);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledWith(3);
	});

	it('clears the timer on unmount', () => {
		const cb = vi.fn();
		let debounced!: () => void;
		const Harness = defineComponent({
			setup() {
				debounced = useDebouncedCallback(cb, 100);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		debounced();
		unmount();
		vi.advanceTimersByTime(200);
		expect(cb).not.toHaveBeenCalled();
	});
});
