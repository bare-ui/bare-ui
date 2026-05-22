import { act, renderHook } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '@/hooks/use-debounce';

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns the initial value synchronously', () => {
		const { result } = renderHook(() => useDebounce('initial', 200));
		expect(result.current).toBe('initial');
	});

	it('does not update until the delay has elapsed', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'b' });
		expect(result.current).toBe('a');

		act(() => {
			vi.advanceTimersByTime(199);
		});
		expect(result.current).toBe('a');

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe('b');
	});

	it('resets the timer on rapid value changes', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'b' });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		rerender({ value: 'c' });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe('a');

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe('c');
	});

	it('uses the latest delay when delay prop changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'a', delay: 500 },
		});

		rerender({ value: 'b', delay: 100 });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe('b');
	});

	it('cleans up the pending timer on unmount', () => {
		const { rerender, unmount } = renderHook(({ value }) => useDebounce(value, 200), {
			initialProps: { value: 'a' },
		});
		rerender({ value: 'b' });
		unmount();
		// Advancing timers after unmount should not throw.
		expect(() =>
			act(() => {
				vi.advanceTimersByTime(500);
			}),
		).not.toThrow();
	});
});

describe('useDebouncedCallback', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('does not invoke the callback immediately', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(cb, 200));
		result.current('x');
		expect(cb).not.toHaveBeenCalled();
	});

	it('invokes the callback once after the delay with the latest args', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(cb, 200));
		result.current('a');
		result.current('b');
		result.current('c');

		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledWith('c');
	});

	it('returns a stable function across re-renders when callback identity changes', () => {
		const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 200), {
			initialProps: { cb: () => {} },
		});
		const first = result.current;
		rerender({ cb: () => {} });
		expect(result.current).toBe(first);
	});

	it('always calls the most recent callback reference', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 200), {
			initialProps: { cb: first },
		});

		result.current('hello');
		rerender({ cb: second });

		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledWith('hello');
	});

	it('cancels the pending callback when the component unmounts', () => {
		const cb = vi.fn();
		const { result, unmount } = renderHook(() => useDebouncedCallback(cb, 200));
		result.current('x');
		unmount();
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(cb).not.toHaveBeenCalled();
	});
});
