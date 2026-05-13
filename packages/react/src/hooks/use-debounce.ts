import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns `value` debounced — only updates after `delay` ms have passed without a change.
 *
 * Use for derived state that drives expensive work (network requests, filters).
 *
 * @example
 * const debouncedQuery = useDebounce(query, 250)
 * useEffect(() => { search(debouncedQuery) }, [debouncedQuery])
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);

	return debounced;
}

/**
 * Returns a stable, debounced version of `callback` that fires `delay` ms after the
 * most recent invocation. Always calls the latest `callback` reference, so closure-captured
 * values stay fresh without resetting the timer.
 *
 * @example
 * const debouncedSave = useDebouncedCallback((value: string) => save(value), 500)
 */
export function useDebouncedCallback<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
): (...args: Args) => void {
	const callbackRef = useRef(callback);
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => () => {
		if (timerRef.current) clearTimeout(timerRef.current);
	}, []);

	return useCallback(
		(...args: Args) => {
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
		},
		[delay],
	);
}
