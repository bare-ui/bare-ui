import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref, type Ref } from 'vue';
import { useThrottle, useThrottledCallback } from '@/composables/use-throttle';

describe('useThrottle', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('returns the initial value synchronously', () => {
		let throttled!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				throttled = useThrottle(ref(1), 100);
				return () => h('div');
			},
		});
		render(Harness);
		expect(throttled.value).toBe(1);
	});

	it('updates to the latest value after the throttle window', async () => {
		let throttled!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(0);
				throttled = useThrottle(source, 100);
				return () => h('div');
			},
		});
		render(Harness);
		source.value = 1;
		await nextTick();
		vi.advanceTimersByTime(100);
		expect(throttled.value).toBe(1);
	});

	it('only emits the latest value for changes within the window', async () => {
		let throttled!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(0);
				throttled = useThrottle(source, 100);
				return () => h('div');
			},
		});
		render(Harness);
		source.value = 1;
		await nextTick();
		source.value = 2;
		await nextTick();
		source.value = 3;
		await nextTick();
		vi.advanceTimersByTime(100);
		expect(throttled.value).toBe(3);
	});

	it('clears the timer on unmount', async () => {
		let throttled!: Ref<number>;
		let source!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				source = ref(0);
				throttled = useThrottle(source, 100);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		source.value = 5;
		await nextTick();
		unmount();
		vi.advanceTimersByTime(500);
		expect(throttled.value).toBe(0);
	});
});

describe('useThrottledCallback', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('calls immediately on the leading edge', () => {
		const cb = vi.fn();
		let throttled!: (n: number) => void;
		const Harness = defineComponent({
			setup() {
				throttled = useThrottledCallback(cb, 100);
				return () => h('div');
			},
		});
		render(Harness);
		throttled(1);
		expect(cb).toHaveBeenCalledWith(1);
	});

	it('drops subsequent calls within the delay window', () => {
		const cb = vi.fn();
		let throttled!: (n: number) => void;
		const Harness = defineComponent({
			setup() {
				throttled = useThrottledCallback(cb, 100);
				return () => h('div');
			},
		});
		render(Harness);
		throttled(1);
		throttled(2);
		throttled(3);
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledWith(1);
	});

	it('allows calling again after the delay has elapsed', () => {
		const cb = vi.fn();
		let throttled!: (n: number) => void;
		const Harness = defineComponent({
			setup() {
				throttled = useThrottledCallback(cb, 100);
				return () => h('div');
			},
		});
		render(Harness);
		throttled(1);
		vi.advanceTimersByTime(100);
		throttled(2);
		expect(cb).toHaveBeenCalledTimes(2);
		expect(cb).toHaveBeenLastCalledWith(2);
	});
});
