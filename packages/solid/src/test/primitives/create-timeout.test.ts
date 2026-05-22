import { renderHook } from '@solidjs/testing-library';
import { createTimeout, type CreateTimeoutOptions, type CreateTimeoutResult } from '@/primitives/create-timeout';

function mount(cb: () => void, delay: number, options: CreateTimeoutOptions = {}) {
	return renderHook(() => createTimeout(cb, delay, options));
}

describe('createTimeout', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not fire before the delay when autoStarted', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100);
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		cleanup();
	});

	it('fires after the delay when autoStarted', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does not start automatically when autoStart is false', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100, { autoStart: false });
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		cleanup();
	});

	it('isPending reflects timer state', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, 100, { autoStart: false }) as { result: CreateTimeoutResult; cleanup: () => void };
		expect(result.isPending()).toBe(false);
		result.start();
		expect(result.isPending()).toBe(true);
		result.stop();
		expect(result.isPending()).toBe(false);
		cleanup();
	});

	it('stop() prevents firing', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, 100);
		result.stop();
		vi.advanceTimersByTime(200);
		expect(cb).not.toHaveBeenCalled();
		cleanup();
	});

	it('reset() restarts the timer', () => {
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

	it('marks isPending false after firing', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, 100);
		vi.advanceTimersByTime(100);
		expect(result.isPending()).toBe(false);
		cleanup();
	});

	it('clears the timer on cleanup', () => {
		const cb = vi.fn();
		const { cleanup } = mount(cb, 100);
		cleanup();
		vi.advanceTimersByTime(200);
		expect(cb).not.toHaveBeenCalled();
	});
});
