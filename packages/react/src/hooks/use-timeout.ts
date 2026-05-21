import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTimeoutOptions {
	/** Start the timeout immediately on mount. Defaults to `true`. */
	autoStart?: boolean;
}

export interface UseTimeoutResult {
	/** `true` while a scheduled timeout is pending. */
	isPending: boolean;
	/** Cancel any pending timeout and start a new one. */
	start: () => void;
	/** Cancel any pending timeout without firing the callback. */
	stop: () => void;
	/** Cancel any pending timeout and start a new one (alias for `start`). */
	reset: () => void;
}

/**
 * Schedules `callback` to fire once after `delay` ms.
 *
 * Returns imperative controls so the timeout can be paused, cancelled, or restarted.
 * The latest `callback` is always invoked — passing an inline function is safe.
 *
 * @example
 * const { start, stop, isPending } = useTimeout(() => setShown(false), 3000)
 */
export function useTimeout(callback: () => void, delay: number, options: UseTimeoutOptions = {}): UseTimeoutResult {
	const { autoStart = true } = options;
	const callbackRef = useRef(callback);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const stop = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
			setIsPending(false);
		}
	}, []);

	const start = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setIsPending(true);
		timerRef.current = setTimeout(() => {
			timerRef.current = null;
			setIsPending(false);
			callbackRef.current();
		}, delay);
	}, [delay]);

	useEffect(() => {
		if (autoStart) start();
		return stop;
	}, [autoStart, start, stop]);

	return { isPending, start, stop, reset: start };
}
