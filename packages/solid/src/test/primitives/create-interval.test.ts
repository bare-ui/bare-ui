import { renderHook } from '@solidjs/testing-library';
import { createInterval, type CreateIntervalOptions } from '@/primitives/create-interval';

function mount(cb: () => void, delay: number | null, options: CreateIntervalOptions = {}) {
	return renderHook(() => createInterval(cb, delay, options));
}

describe('createInterval', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not fire before the interval', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100);
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		cleanup();
	});

	it('fires repeatedly at each interval boundary', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(200);
		expect(cb).toHaveBeenCalledTimes(4);
		cleanup();
	});

	it('does not start when autoStart is false', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100, { autoStart: false });
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		cleanup();
	});

	it('fires immediately on start when immediate is true', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100, { immediate: true });
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does not start when delay is null', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, null);
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		cleanup();
	});

	it('stop() halts further calls and resets isRunning', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, 100);
		expect(result.isRunning()).toBe(true);
		vi.advanceTimersByTime(100);
		result.stop();
		expect(result.isRunning()).toBe(false);
		vi.advanceTimersByTime(500);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('start() resumes after stop()', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, 100);
		result.stop();
		result.start();
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('reset() restarts the interval countdown', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, 100);
		vi.advanceTimersByTime(50);
		result.reset();
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(50);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('cleans up on cleanup', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100);
		cleanup();
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
	});
});
