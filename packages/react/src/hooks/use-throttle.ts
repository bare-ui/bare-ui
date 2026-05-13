import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns `value` throttled — updates at most once every `delay` ms.
 *
 * Use for derived state from high-frequency events (scroll, mousemove) where you
 * want regular sampling rather than waiting for inactivity.
 *
 * @example
 * const throttledScroll = useThrottle(scrollY, 100)
 */
export function useThrottle<T>(value: T, delay: number): T {
	const [throttled, setThrottled] = useState(value);
	const lastEmittedAt = useRef(0);

	useEffect(() => {
		const elapsed = Date.now() - lastEmittedAt.current;
		const remaining = Math.max(0, delay - elapsed);
		const id = setTimeout(() => {
			lastEmittedAt.current = Date.now();
			setThrottled(value);
		}, remaining);
		return () => clearTimeout(id);
	}, [value, delay]);

	return throttled;
}

/**
 * Returns a stable, throttled version of `callback` that runs at most once per `delay` ms.
 * Fires on the leading edge; trailing calls are dropped.
 *
 * @example
 * const onScroll = useThrottledCallback(() => track(), 200)
 */
export function useThrottledCallback<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
): (...args: Args) => void {
	const callbackRef = useRef(callback);
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);
	const lastInvokedAt = useRef(0);

	return useCallback(
		(...args: Args) => {
			const now = Date.now();
			if (now - lastInvokedAt.current >= delay) {
				lastInvokedAt.current = now;
				callbackRef.current(...args);
			}
		},
		[delay],
	);
}
