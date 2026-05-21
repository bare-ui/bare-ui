import { useEffect, useRef } from 'react';

/**
 * Returns the value `value` held during the previous render. Returns `undefined`
 * on the first render.
 *
 * @example
 * const prev = usePrevious(count)
 * useEffect(() => {
 *   if (prev !== undefined && prev !== count) onChange(prev, count)
 * }, [count])
 */
export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T | undefined>(undefined);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}
