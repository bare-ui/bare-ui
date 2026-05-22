import { act, renderHook } from '@testing-library/react';
import { useLongPress } from '@/hooks/use-long-press';

function pointer(init: Partial<{ clientX: number; clientY: number }> = {}) {
	return {
		clientX: init.clientX ?? 0,
		clientY: init.clientY ?? 0,
		// React's synthetic-event surface — only the fields the hook reads.
	} as unknown as React.PointerEvent;
}

describe('useLongPress', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('fires callback after the default threshold (400ms)', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useLongPress(cb));
		act(() => {
			result.current.onPointerDown(pointer());
		});
		expect(cb).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(400);
		});
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('respects a custom threshold', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { threshold: 1000 }));
		act(() => {
			result.current.onPointerDown(pointer());
		});
		act(() => {
			vi.advanceTimersByTime(400);
		});
		expect(cb).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(600);
		});
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('cancels when pointerUp fires before threshold and calls onCancel', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const onFinish = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { onCancel, onFinish }));
		act(() => {
			result.current.onPointerDown(pointer());
		});
		act(() => {
			vi.advanceTimersByTime(100);
			result.current.onPointerUp(pointer());
		});
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onFinish).not.toHaveBeenCalled();
	});

	it('fires onFinish when pointerUp happens after threshold', () => {
		const cb = vi.fn();
		const onFinish = vi.fn();
		const onCancel = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { onFinish, onCancel }));
		act(() => {
			result.current.onPointerDown(pointer());
			vi.advanceTimersByTime(400);
		});
		act(() => {
			result.current.onPointerUp(pointer());
		});
		expect(cb).toHaveBeenCalledTimes(1);
		expect(onFinish).toHaveBeenCalledTimes(1);
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('cancels when pointerMove exceeds moveThreshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { moveThreshold: 10, onCancel }));
		act(() => {
			result.current.onPointerDown(pointer({ clientX: 0, clientY: 0 }));
			result.current.onPointerMove(pointer({ clientX: 50, clientY: 0 }));
		});
		act(() => {
			vi.advanceTimersByTime(400);
		});
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('does not cancel for small movements within moveThreshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { moveThreshold: 10, onCancel }));
		act(() => {
			result.current.onPointerDown(pointer({ clientX: 0, clientY: 0 }));
			result.current.onPointerMove(pointer({ clientX: 3, clientY: 2 }));
			vi.advanceTimersByTime(400);
		});
		expect(cb).toHaveBeenCalledTimes(1);
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('cancels on pointerLeave before threshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { onCancel }));
		act(() => {
			result.current.onPointerDown(pointer());
			result.current.onPointerLeave(pointer());
		});
		act(() => {
			vi.advanceTimersByTime(400);
		});
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('does nothing when disabled', () => {
		const cb = vi.fn();
		const onStart = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { disabled: true, onStart }));
		act(() => {
			result.current.onPointerDown(pointer());
			vi.advanceTimersByTime(400);
		});
		expect(cb).not.toHaveBeenCalled();
		expect(onStart).not.toHaveBeenCalled();
	});

	it('calls onStart on pointerDown', () => {
		const cb = vi.fn();
		const onStart = vi.fn();
		const { result } = renderHook(() => useLongPress(cb, { onStart }));
		act(() => {
			result.current.onPointerDown(pointer());
		});
		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it('clears pending timer on unmount', () => {
		const cb = vi.fn();
		const { result, unmount } = renderHook(() => useLongPress(cb));
		act(() => {
			result.current.onPointerDown(pointer());
		});
		unmount();
		act(() => {
			vi.advanceTimersByTime(400);
		});
		expect(cb).not.toHaveBeenCalled();
	});
});
