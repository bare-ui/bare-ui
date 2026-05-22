import { act, renderHook } from '@testing-library/react';
import { useTimeout } from '@/hooks/use-timeout';

describe('useTimeout', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('auto-starts and reports isPending = true on mount', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useTimeout(cb, 1000));
		expect(result.current.isPending).toBe(true);
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires the callback after the delay and clears isPending', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useTimeout(cb, 1000));
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(cb).toHaveBeenCalledTimes(1);
		expect(result.current.isPending).toBe(false);
	});

	it('does not auto-start when autoStart is false', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useTimeout(cb, 1000, { autoStart: false }));
		expect(result.current.isPending).toBe(false);
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(cb).not.toHaveBeenCalled();
	});

	it('start() begins a new timeout and stop() cancels it', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useTimeout(cb, 1000, { autoStart: false }));

		act(() => {
			result.current.start();
		});
		expect(result.current.isPending).toBe(true);

		act(() => {
			result.current.stop();
		});
		expect(result.current.isPending).toBe(false);

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(cb).not.toHaveBeenCalled();
	});

	it('reset() restarts the countdown from zero', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useTimeout(cb, 1000));

		act(() => {
			vi.advanceTimersByTime(500);
		});
		act(() => {
			result.current.reset();
		});
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(cb).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('calls the latest callback reference when fired', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(({ cb }) => useTimeout(cb, 1000), {
			initialProps: { cb: first },
		});

		rerender({ cb: second });
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});

	it('cancels the pending timeout on unmount', () => {
		const cb = vi.fn();
		const { unmount } = renderHook(() => useTimeout(cb, 1000));
		unmount();
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(cb).not.toHaveBeenCalled();
	});

	it('calling start() while pending restarts the timer', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useTimeout(cb, 1000));

		act(() => {
			vi.advanceTimersByTime(800);
		});
		act(() => {
			result.current.start();
		});
		act(() => {
			vi.advanceTimersByTime(800);
		});
		expect(cb).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(cb).toHaveBeenCalledTimes(1);
	});
});
