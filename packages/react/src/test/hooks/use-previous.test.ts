import { renderHook } from '@testing-library/react';
import { usePrevious } from '@/hooks/use-previous';

describe('usePrevious', () => {
	it('returns undefined on the first render', () => {
		const { result } = renderHook(({ value }: { value: number }) => usePrevious(value), {
			initialProps: { value: 1 },
		});
		expect(result.current).toBeUndefined();
	});

	it('returns the previous value after a rerender', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: number }) => usePrevious(value),
			{ initialProps: { value: 1 } },
		);
		rerender({ value: 2 });
		expect(result.current).toBe(1);
	});

	it('tracks the previous value across multiple updates', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: number }) => usePrevious(value),
			{ initialProps: { value: 1 } },
		);
		rerender({ value: 2 });
		rerender({ value: 3 });
		expect(result.current).toBe(2);
		rerender({ value: 4 });
		expect(result.current).toBe(3);
	});

	it('works with string values', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: string }) => usePrevious(value),
			{ initialProps: { value: 'a' } },
		);
		rerender({ value: 'b' });
		expect(result.current).toBe('a');
	});

	it('works with object values', () => {
		const a = { id: 1 };
		const b = { id: 2 };
		const { result, rerender } = renderHook(
			({ value }: { value: { id: number } }) => usePrevious(value),
			{ initialProps: { value: a } },
		);
		rerender({ value: b });
		expect(result.current).toBe(a);
	});

	it('settles to the latest value after a rerender with the same value', () => {
		const { result, rerender } = renderHook(
			({ value }: { value: number }) => usePrevious(value),
			{ initialProps: { value: 5 } },
		);
		// First render returns undefined; after the post-commit effect runs and we rerender
		// (even with the same value), the ref now reflects the previously-rendered value.
		rerender({ value: 5 });
		expect(result.current).toBe(5);
		rerender({ value: 6 });
		expect(result.current).toBe(5);
	});
});
