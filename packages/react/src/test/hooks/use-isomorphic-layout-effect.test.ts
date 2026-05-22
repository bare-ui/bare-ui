import { useLayoutEffect } from 'react';
import { renderHook } from '@testing-library/react';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';

describe('useIsomorphicLayoutEffect', () => {
	it('is a function', () => {
		expect(typeof useIsomorphicLayoutEffect).toBe('function');
	});

	it('resolves to useLayoutEffect when window is defined (jsdom)', () => {
		expect(typeof window).toBe('object');
		expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
	});

	it('runs the provided effect after render', () => {
		const fn = vi.fn();
		renderHook(() => useIsomorphicLayoutEffect(fn, []));
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('runs cleanup on unmount', () => {
		const cleanup = vi.fn();
		const { unmount } = renderHook(() =>
			useIsomorphicLayoutEffect(() => cleanup, []),
		);
		expect(cleanup).not.toHaveBeenCalled();
		unmount();
		expect(cleanup).toHaveBeenCalledTimes(1);
	});

	it('reruns when dependencies change', () => {
		const fn = vi.fn();
		const { rerender } = renderHook(
			({ dep }: { dep: number }) => useIsomorphicLayoutEffect(fn, [dep]),
			{ initialProps: { dep: 1 } },
		);
		expect(fn).toHaveBeenCalledTimes(1);
		rerender({ dep: 2 });
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it('does not rerun when dependencies are unchanged', () => {
		const fn = vi.fn();
		const { rerender } = renderHook(
			({ dep }: { dep: number }) => useIsomorphicLayoutEffect(fn, [dep]),
			{ initialProps: { dep: 1 } },
		);
		rerender({ dep: 1 });
		expect(fn).toHaveBeenCalledTimes(1);
	});
});
