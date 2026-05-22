import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createThrottle, createThrottledCallback } from '@/primitives/create-throttle';

describe('createThrottle', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('returns the initial value synchronously', () => {
		const [value] = createSignal(1);
		const { result, cleanup } = renderHook(() => createThrottle(value, 100));
		expect(result()).toBe(1);
		cleanup();
	});

	it('updates after the throttle window', () => {
		const [value, setValue] = createSignal(0);
		const { result, cleanup } = renderHook(() => createThrottle(value, 100));
		setValue(1);
		vi.advanceTimersByTime(100);
		expect(result()).toBe(1);
		cleanup();
	});

	it('emits the latest value when multiple changes happen within the window', () => {
		const [value, setValue] = createSignal(0);
		const { result, cleanup } = renderHook(() => createThrottle(value, 100));
		setValue(1);
		setValue(2);
		setValue(3);
		vi.advanceTimersByTime(100);
		expect(result()).toBe(3);
		cleanup();
	});

	it('clears the timer on dispose', () => {
		const [value, setValue] = createSignal(0);
		const { result, cleanup } = renderHook(() => createThrottle(value, 100));
		setValue(5);
		cleanup();
		vi.advanceTimersByTime(500);
		expect(result()).toBe(0);
	});
});

describe('createThrottledCallback', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('calls immediately on the leading edge', () => {
		const cb = vi.fn();
		const throttled = createThrottledCallback(cb, 100);
		throttled(1);
		expect(cb).toHaveBeenCalledWith(1);
	});

	it('drops calls within the delay window', () => {
		const cb = vi.fn();
		const throttled = createThrottledCallback(cb, 100);
		throttled(1);
		throttled(2);
		throttled(3);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('allows calling again after the window elapses', () => {
		const cb = vi.fn();
		const throttled = createThrottledCallback(cb, 100);
		throttled(1);
		vi.advanceTimersByTime(100);
		throttled(2);
		expect(cb).toHaveBeenCalledTimes(2);
		expect(cb).toHaveBeenLastCalledWith(2);
	});
});
