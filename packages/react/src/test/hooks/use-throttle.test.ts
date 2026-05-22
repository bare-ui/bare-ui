import { act, renderHook } from '@testing-library/react';
import { useThrottle, useThrottledCallback } from '@/hooks/use-throttle';

describe('useThrottle', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns the initial value synchronously', () => {
		const { result } = renderHook(() => useThrottle('initial', 100));
		expect(result.current).toBe('initial');
	});

	it('emits the latest value after the throttle window', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottle(value, 100), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'b' });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe('b');
	});

	it('coalesces rapid updates to the latest value', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottle(value, 100), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'b' });
		rerender({ value: 'c' });
		rerender({ value: 'd' });

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe('d');
	});

	it('does not throw when unmounted before the throttle resolves', () => {
		const { rerender, unmount } = renderHook(({ value }) => useThrottle(value, 100), {
			initialProps: { value: 'a' },
		});
		rerender({ value: 'b' });
		unmount();
		expect(() =>
			act(() => {
				vi.advanceTimersByTime(200);
			}),
		).not.toThrow();
	});
});

describe('useThrottledCallback', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		// Start clock well past zero so the leading-edge check (`Date.now() - 0 >= delay`)
		// fires on the very first invocation.
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('invokes the callback immediately on the leading edge', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useThrottledCallback(cb, 200));
		result.current('a');
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledWith('a');
	});

	it('drops trailing calls within the throttle window', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useThrottledCallback(cb, 200));
		result.current('a');
		act(() => {
			vi.advanceTimersByTime(50);
		});
		result.current('b');
		act(() => {
			vi.advanceTimersByTime(100);
		});
		result.current('c');
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledWith('a');
	});

	it('fires again after the throttle window has elapsed', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useThrottledCallback(cb, 200));
		result.current('a');
		act(() => {
			vi.advanceTimersByTime(200);
		});
		result.current('b');
		expect(cb).toHaveBeenCalledTimes(2);
		expect(cb).toHaveBeenLastCalledWith('b');
	});

	it('returns a stable function when only the callback identity changes', () => {
		const { result, rerender } = renderHook(({ cb }) => useThrottledCallback(cb, 100), {
			initialProps: { cb: () => {} },
		});
		const first = result.current;
		rerender({ cb: () => {} });
		expect(result.current).toBe(first);
	});

	it('always invokes the latest callback reference', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { result, rerender } = renderHook(({ cb }) => useThrottledCallback(cb, 200), {
			initialProps: { cb: first },
		});

		rerender({ cb: second });
		result.current('hi');
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledWith('hi');
	});
});
