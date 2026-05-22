import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { useTimeout, type UseTimeoutResult } from '@/composables/use-timeout';

function mount(cb: () => void, delay: number, autoStart = true): UseTimeoutResult {
	let captured!: UseTimeoutResult;
	const Harness = defineComponent({
		setup() {
			captured = useTimeout(cb, delay, { autoStart });
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useTimeout', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not fire callback before the delay when autoStarted', () => {
		const cb = vi.fn();
		mount(cb, 100);
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires callback after the delay when autoStarted', () => {
		const cb = vi.fn();
		mount(cb, 100);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not start automatically when autoStart is false', () => {
		const cb = vi.fn();
		mount(cb, 100, false);
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
	});

	it('isPending reflects timer state', () => {
		const cb = vi.fn();
		const { isPending, start, stop } = mount(cb, 100, false);
		expect(isPending.value).toBe(false);
		start();
		expect(isPending.value).toBe(true);
		stop();
		expect(isPending.value).toBe(false);
	});

	it('stop() prevents the callback from firing', () => {
		const cb = vi.fn();
		const { stop } = mount(cb, 100);
		stop();
		vi.advanceTimersByTime(200);
		expect(cb).not.toHaveBeenCalled();
	});

	it('reset() restarts the timer', () => {
		const cb = vi.fn();
		const { reset } = mount(cb, 100);
		vi.advanceTimersByTime(50);
		reset();
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(50);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('marks isPending false after firing', () => {
		const cb = vi.fn();
		const { isPending } = mount(cb, 100);
		vi.advanceTimersByTime(100);
		expect(isPending.value).toBe(false);
	});

	it('clears the timer on unmount', () => {
		const cb = vi.fn();
		let captured!: UseTimeoutResult;
		const Harness = defineComponent({
			setup() {
				captured = useTimeout(cb, 100);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		expect(captured.isPending.value).toBe(true);
		unmount();
		vi.advanceTimersByTime(200);
		expect(cb).not.toHaveBeenCalled();
	});
});
