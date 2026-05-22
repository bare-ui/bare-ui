import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createDebounce, createDebouncedCallback } from '@/primitives/create-debounce';

describe('createDebounce', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('returns the initial value synchronously', () => {
		const [value] = createSignal(1);
		const { result, cleanup } = renderHook(() => createDebounce(value, 100));
		expect(result()).toBe(1);
		cleanup();
	});

	it('does not update before the delay elapses', () => {
		const [value, setValue] = createSignal(1);
		const { result, cleanup } = renderHook(() => createDebounce(value, 100));
		setValue(2);
		vi.advanceTimersByTime(50);
		expect(result()).toBe(1);
		cleanup();
	});

	it('updates after the delay', () => {
		const [value, setValue] = createSignal(1);
		const { result, cleanup } = renderHook(() => createDebounce(value, 100));
		setValue(2);
		vi.advanceTimersByTime(100);
		expect(result()).toBe(2);
		cleanup();
	});

	it('coalesces rapid changes — only the last emits', () => {
		const [value, setValue] = createSignal(0);
		const { result, cleanup } = renderHook(() => createDebounce(value, 100));
		setValue(1);
		vi.advanceTimersByTime(50);
		setValue(2);
		vi.advanceTimersByTime(50);
		setValue(3);
		expect(result()).toBe(0);
		vi.advanceTimersByTime(100);
		expect(result()).toBe(3);
		cleanup();
	});

	it('clears the timer on dispose', () => {
		const [value, setValue] = createSignal(1);
		const { result, cleanup } = renderHook(() => createDebounce(value, 100));
		setValue(2);
		cleanup();
		vi.advanceTimersByTime(200);
		expect(result()).toBe(1);
	});
});

describe('createDebouncedCallback', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('does not call before the delay', () => {
		const cb = vi.fn();
		const { result, cleanup } = renderHook(() => createDebouncedCallback(cb, 100));
		result(1);
		vi.advanceTimersByTime(50);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(50);
		expect(cb).toHaveBeenCalledWith(1);
		cleanup();
	});

	it('coalesces rapid calls — only the last args used', () => {
		const cb = vi.fn();
		const { result, cleanup } = renderHook(() => createDebouncedCallback(cb, 100));
		result(1);
		result(2);
		result(3);
		vi.advanceTimersByTime(100);
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toHaveBeenCalledWith(3);
		cleanup();
	});

	it('clears the timer on dispose', () => {
		const cb = vi.fn();
		const { result, cleanup } = renderHook(() => createDebouncedCallback(cb, 100));
		result();
		cleanup();
		vi.advanceTimersByTime(200);
		expect(cb).not.toHaveBeenCalled();
	});
});
