import { renderHook, act } from '@testing-library/react';
import { useControllableState } from '@/hooks/use-controllable-state';

describe('useControllableState', () => {
	it('uses defaultValue when uncontrolled', () => {
		const { result } = renderHook(() => useControllableState({ defaultValue: 'a' }));
		expect(result.current[0]).toBe('a');
	});

	it('updates internal state when uncontrolled', () => {
		const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));
		act(() => result.current[1](5));
		expect(result.current[0]).toBe(5);
	});

	it('supports functional updates in uncontrolled mode', () => {
		const { result } = renderHook(() => useControllableState({ defaultValue: 1 }));
		act(() => result.current[1]((prev) => (prev ?? 0) + 10));
		expect(result.current[0]).toBe(11);
	});

	it('calls onChange in uncontrolled mode', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));
		act(() => result.current[1]('b'));
		expect(onChange).toHaveBeenCalledWith('b');
	});

	it('reflects the controlled value', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: number }) => useControllableState({ value }),
			{ initialProps: { value: 1 } },
		);
		expect(result.current[0]).toBe(1);
		rerender({ value: 2 });
		expect(result.current[0]).toBe(2);
	});

	it('does not mutate internal state when controlled, but calls onChange', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useControllableState({ value: 'fixed', onChange }));
		act(() => result.current[1]('next'));
		// Value remains the controlled one because parent did not update it.
		expect(result.current[0]).toBe('fixed');
		expect(onChange).toHaveBeenCalledWith('next');
	});

	it('passes the controlled value to a functional updater', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useControllableState<number>({ value: 10, onChange }));
		act(() => result.current[1]((prev) => (prev ?? 0) + 1));
		expect(onChange).toHaveBeenCalledWith(11);
	});

	it('does not call onChange when resolved value is undefined', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useControllableState<string>({ defaultValue: 'x', onChange }));
		act(() => result.current[1](undefined));
		expect(onChange).not.toHaveBeenCalled();
	});
});
