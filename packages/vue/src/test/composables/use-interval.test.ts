import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { useInterval, type UseIntervalOptions, type UseIntervalResult } from '@/composables/use-interval';

function mount(cb: () => void, delay: number | null, options: UseIntervalOptions = {}): UseIntervalResult {
	let captured!: UseIntervalResult;
	const Harness = defineComponent({
		setup() {
			captured = useInterval(cb, delay, options);
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useInterval', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not fire before the interval', () => {
		const cb = vi.fn();
		mount(cb, 100);
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires repeatedly at each interval boundary', () => {
		const cb = vi.fn();
		mount(cb, 100);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(200);
		expect(cb).toHaveBeenCalledTimes(4);
	});

	it('does not start when autoStart is false', () => {
		const cb = vi.fn();
		mount(cb, 100, { autoStart: false });
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires immediately on start when immediate is true', () => {
		const cb = vi.fn();
		mount(cb, 100, { immediate: true });
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not start when delay is null', () => {
		const cb = vi.fn();
		mount(cb, null);
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
	});

	it('stop() halts further calls and resets isRunning', () => {
		const cb = vi.fn();
		const { stop, isRunning } = mount(cb, 100);
		expect(isRunning.value).toBe(true);
		vi.advanceTimersByTime(100);
		stop();
		expect(isRunning.value).toBe(false);
		vi.advanceTimersByTime(500);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('start() resumes after stop()', () => {
		const cb = vi.fn();
		const { stop, start } = mount(cb, 100);
		stop();
		start();
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('reset() restarts the interval countdown', () => {
		const cb = vi.fn();
		const { reset } = mount(cb, 100);
		vi.advanceTimersByTime(50);
		reset();
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(50);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('cleans up on unmount', () => {
		const cb = vi.fn();
		let captured!: UseIntervalResult;
		const Harness = defineComponent({
			setup() {
				captured = useInterval(cb, 100);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		expect(captured.isRunning.value).toBe(true);
		unmount();
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
	});
});
