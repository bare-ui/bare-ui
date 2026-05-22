import { useLongPress, type LongPressHandlers } from '@/composables/use-long-press';

function pointerEvent(type: string, init: Partial<PointerEventInit> = {}): PointerEvent {
	return new PointerEvent(type, { bubbles: true, ...init });
}

describe('useLongPress', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('fires the callback after the threshold', () => {
		const cb = vi.fn();
		const handlers: LongPressHandlers = useLongPress(cb);
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		vi.advanceTimersByTime(400);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('respects a custom threshold', () => {
		const cb = vi.fn();
		const handlers = useLongPress(cb, { threshold: 1000 });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		vi.advanceTimersByTime(400);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(600);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not fire when pointer is released early', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const handlers = useLongPress(cb, { onCancel });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		vi.advanceTimersByTime(200);
		handlers.onPointerup(pointerEvent('pointerup'));
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('cancels when the pointer leaves before the threshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const handlers = useLongPress(cb, { onCancel });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		handlers.onPointerleave(pointerEvent('pointerleave'));
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('cancels when the pointer moves past moveThreshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const handlers = useLongPress(cb, { onCancel, moveThreshold: 10 });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		handlers.onPointermove(pointerEvent('pointermove', { clientX: 20, clientY: 0 }));
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('does not cancel for small moves within moveThreshold', () => {
		const cb = vi.fn();
		const handlers = useLongPress(cb, { moveThreshold: 10 });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		handlers.onPointermove(pointerEvent('pointermove', { clientX: 5, clientY: 5 }));
		vi.advanceTimersByTime(400);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('calls onStart on pointerdown', () => {
		const onStart = vi.fn();
		const handlers = useLongPress(vi.fn(), { onStart });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it('calls onFinish when held long enough then released', () => {
		const onFinish = vi.fn();
		const handlers = useLongPress(vi.fn(), { onFinish });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		vi.advanceTimersByTime(400);
		handlers.onPointerup(pointerEvent('pointerup'));
		expect(onFinish).toHaveBeenCalledTimes(1);
	});

	it('does nothing on pointerdown when disabled', () => {
		const cb = vi.fn();
		const onStart = vi.fn();
		const handlers = useLongPress(cb, { disabled: true, onStart });
		handlers.onPointerdown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
		vi.advanceTimersByTime(1000);
		expect(cb).not.toHaveBeenCalled();
		expect(onStart).not.toHaveBeenCalled();
	});
});
