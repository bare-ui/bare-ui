import { renderHook } from '@testing-library/react';
import { createRef, useRef, type MutableRefObject } from 'react';
import { useMergedRefs } from '@/hooks/use-merged-refs';

describe('useMergedRefs', () => {
	it('returns a callback function', () => {
		const { result } = renderHook(() => useMergedRefs<HTMLDivElement>());
		expect(typeof result.current).toBe('function');
	});

	it('assigns the value to an object ref', () => {
		const ref = createRef<HTMLDivElement>();
		const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(ref));
		const el = document.createElement('div');
		result.current(el);
		expect(ref.current).toBe(el);
	});

	it('invokes a callback ref with the value', () => {
		const cb = vi.fn();
		const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(cb));
		const el = document.createElement('div');
		result.current(el);
		expect(cb).toHaveBeenCalledWith(el);
	});

	it('assigns the same value to multiple refs', () => {
		const objRef = createRef<HTMLDivElement>();
		const cb = vi.fn();
		const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(objRef, cb));
		const el = document.createElement('div');
		result.current(el);
		expect(objRef.current).toBe(el);
		expect(cb).toHaveBeenCalledWith(el);
	});

	it('safely ignores null and undefined refs', () => {
		const objRef = createRef<HTMLDivElement>();
		const { result } = renderHook(() =>
			useMergedRefs<HTMLDivElement>(objRef, null, undefined),
		);
		const el = document.createElement('div');
		expect(() => result.current(el)).not.toThrow();
		expect(objRef.current).toBe(el);
	});

	it('propagates null on unmount-style cleanup', () => {
		const objRef = createRef<HTMLDivElement>();
		const cb = vi.fn();
		const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(objRef, cb));
		const el = document.createElement('div');
		result.current(el);
		result.current(null);
		expect(objRef.current).toBeNull();
		expect(cb).toHaveBeenLastCalledWith(null);
	});

	it('returns a stable callback when ref identities do not change', () => {
		const objRef = createRef<HTMLDivElement>();
		const cb = vi.fn();
		const { result, rerender } = renderHook(() => useMergedRefs<HTMLDivElement>(objRef, cb));
		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});

	it('works with refs created via useRef', () => {
		const { result } = renderHook(() => {
			const local = useRef<HTMLDivElement | null>(null) as MutableRefObject<HTMLDivElement | null>;
			const merged = useMergedRefs<HTMLDivElement>(local);
			return { local, merged };
		});
		const el = document.createElement('div');
		result.current.merged(el);
		expect(result.current.local.current).toBe(el);
	});
});
