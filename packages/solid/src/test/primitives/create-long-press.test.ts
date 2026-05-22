import { renderHook } from '@solidjs/testing-library';
import { createLongPress, type CreateLongPressOptions } from '@/primitives/create-long-press';

function pointerEvent(type: string, init: Partial<PointerEventInit> = {}): PointerEvent {
	return new PointerEvent(type, { bubbles: true, ...init });
}

function mount(cb: (e: PointerEvent) => void, options: CreateLongPressOptions = {}) {
	return renderHook(() => createLongPress(cb, options));
}

describe('createLongPress', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('fires the callback after the threshold', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb);
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		vi.advanceTimersByTime(400);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('respects a custom threshold', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, { threshold: 1000 });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		vi.advanceTimersByTime(400);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(600);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does not fire when pointer is released early', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const { result, cleanup } = mount(cb, { onCancel });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		vi.advanceTimersByTime(200);
		result.onPointerUp(pointerEvent('pointerup') as never);
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('cancels when the pointer leaves before the threshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const { result, cleanup } = mount(cb, { onCancel });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		result.onPointerLeave(pointerEvent('pointerleave') as never);
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('cancels when the pointer moves past moveThreshold', () => {
		const cb = vi.fn();
		const onCancel = vi.fn();
		const { result, cleanup } = mount(cb, { onCancel, moveThreshold: 10 });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		result.onPointerMove(pointerEvent('pointermove', { clientX: 20, clientY: 0 }) as never);
		vi.advanceTimersByTime(500);
		expect(cb).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does not cancel for small moves within moveThreshold', () => {
		const cb = vi.fn();
		const { result, cleanup } = mount(cb, { moveThreshold: 10 });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		result.onPointerMove(pointerEvent('pointermove', { clientX: 5, clientY: 5 }) as never);
		vi.advanceTimersByTime(400);
		expect(cb).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('calls onStart on pointerdown', () => {
		const onStart = vi.fn();
		const { result, cleanup } = mount(vi.fn(), { onStart });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		expect(onStart).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('calls onFinish when held long enough then released', () => {
		const onFinish = vi.fn();
		const { result, cleanup } = mount(vi.fn(), { onFinish });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		vi.advanceTimersByTime(400);
		result.onPointerUp(pointerEvent('pointerup') as never);
		expect(onFinish).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does nothing on pointerdown when disabled', () => {
		const cb = vi.fn();
		const onStart = vi.fn();
		const { result, cleanup } = mount(cb, { disabled: true, onStart });
		result.onPointerDown(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }) as never);
		vi.advanceTimersByTime(1000);
		expect(cb).not.toHaveBeenCalled();
		expect(onStart).not.toHaveBeenCalled();
		cleanup();
	});
});
