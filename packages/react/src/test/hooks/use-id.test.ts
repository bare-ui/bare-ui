import { renderHook } from '@testing-library/react';
import { useId } from '@/hooks/use-id';

describe('useId', () => {
	it('returns a string with the default "wire-" prefix', () => {
		const { result } = renderHook(() => useId());
		expect(typeof result.current).toBe('string');
		expect(result.current.startsWith('wire-')).toBe(true);
	});

	it('strips colons from the generated id', () => {
		const { result } = renderHook(() => useId());
		expect(result.current).not.toContain(':');
	});

	it('honors a custom prefix', () => {
		const { result } = renderHook(() => useId('label'));
		expect(result.current.startsWith('label-')).toBe(true);
	});

	it('returns the staticId unchanged when provided', () => {
		const { result } = renderHook(() => useId('label', 'my-custom-id'));
		expect(result.current).toBe('my-custom-id');
	});

	it('staticId takes precedence even with a prefix', () => {
		const { result } = renderHook(() => useId('thing', 'forced'));
		expect(result.current).toBe('forced');
	});

	it('returns a stable id across rerenders', () => {
		const { result, rerender } = renderHook(() => useId('x'));
		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});

	it('produces distinct ids for separate hook instances', () => {
		const a = renderHook(() => useId('p'));
		const b = renderHook(() => useId('p'));
		expect(a.result.current).not.toBe(b.result.current);
	});
});
