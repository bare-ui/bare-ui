import { act, renderHook } from '@testing-library/react';
import { useInterval } from '@/hooks/use-interval';

describe('useInterval', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('auto-starts and reports isRunning = true on mount', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useInterval(cb, 1000));
		expect(result.current.isRunning).toBe(true);
		expect(cb).not.toHaveBeenCalled();
	});

	it('invokes the callback on each interval tick', () => {
		const cb = vi.fn();
		renderHook(() => useInterval(cb, 1000));
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(cb).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(cb).toHaveBeenCalledTimes(3);
	});

	it('does not auto-start when autoStart is false', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useInterval(cb, 1000, { autoStart: false }));
		expect(result.current.isRunning).toBe(false);
		act(() => {
			vi.advanceTimersByTime(3000);
		});
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires immediately when immediate=true and continues on interval', () => {
		const cb = vi.fn();
		renderHook(() => useInterval(cb, 1000, { immediate: true }));
		expect(cb).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(cb).toHaveBeenCalledTimes(2);
	});

	it('pauses when delay is null', () => {
		const cb = vi.fn();
		const { result, rerender } = renderHook(({ delay }) => useInterval(cb, delay), {
			initialProps: { delay: 1000 as number | null },
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(cb).toHaveBeenCalledTimes(1);

		rerender({ delay: null });
		expect(result.current.isRunning).toBe(false);

		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('stop() halts the interval and start() resumes it', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useInterval(cb, 1000));

		act(() => {
			result.current.stop();
		});
		expect(result.current.isRunning).toBe(false);

		act(() => {
			vi.advanceTimersByTime(3000);
		});
		expect(cb).not.toHaveBeenCalled();

		act(() => {
			result.current.start();
		});
		expect(result.current.isRunning).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('reset() restarts the countdown to the next tick', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useInterval(cb, 1000));

		act(() => {
			vi.advanceTimersByTime(800);
		});
		act(() => {
			result.current.reset();
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

	it('calls the latest callback reference without restarting the interval', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), {
			initialProps: { cb: first },
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(first).toHaveBeenCalledTimes(1);

		rerender({ cb: second });
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).toHaveBeenCalledTimes(1);
	});

	it('cleans up the interval on unmount', () => {
		const cb = vi.fn();
		const { unmount } = renderHook(() => useInterval(cb, 1000));
		unmount();
		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(cb).not.toHaveBeenCalled();
	});

	it('start() is a no-op when delay is null', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useInterval(cb, null, { autoStart: false }));
		act(() => {
			result.current.start();
		});
		expect(result.current.isRunning).toBe(false);
		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(cb).not.toHaveBeenCalled();
	});
});
