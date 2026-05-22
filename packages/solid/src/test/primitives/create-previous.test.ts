import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createPrevious } from '@/primitives/create-previous';

describe('createPrevious', () => {
	it('returns the initial value as the first observed previous', () => {
		const [count] = createSignal(0);
		const { result, cleanup } = renderHook(() => createPrevious(count));
		expect(result()).toBe(0);
		cleanup();
	});

	it('returns the previous value after a change', () => {
		const [count, setCount] = createSignal(0);
		const { result, cleanup } = renderHook(() => createPrevious(count));
		setCount(1);
		expect(result()).toBe(0);
		cleanup();
	});

	it('tracks multiple sequential changes', () => {
		const [count, setCount] = createSignal(0);
		const { result, cleanup } = renderHook(() => createPrevious(count));
		setCount(1);
		expect(result()).toBe(0);
		setCount(2);
		expect(result()).toBe(1);
		setCount(5);
		expect(result()).toBe(2);
		cleanup();
	});
});
