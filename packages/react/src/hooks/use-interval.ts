import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseIntervalOptions {
	/** Start ticking immediately on mount. Defaults to `true`. */
	autoStart?: boolean;
	/** Fire `callback` once immediately on start, then on each interval. Defaults to `false`. */
	immediate?: boolean;
}

export interface UseIntervalResult {
	/** `true` while the interval is actively ticking. */
	isRunning: boolean;
	/** Begin ticking. No-op if already running. */
	start: () => void;
	/** Stop ticking without firing. */
	stop: () => void;
	/** Stop then start (resets the next-tick countdown). */
	reset: () => void;
}

/**
 * Calls `callback` repeatedly every `delay` ms.
 *
 * Pass `delay = null` to pause without unmounting. The latest `callback` is always
 * invoked, so closure values stay fresh without restarting the interval.
 *
 * @example
 * const { stop, isRunning } = useInterval(() => setNow(Date.now()), 1000)
 */
export function useInterval(
	callback: () => void,
	delay: number | null,
	options: UseIntervalOptions = {},
): UseIntervalResult {
	const { autoStart = true, immediate = false } = options;
	const callbackRef = useRef(callback);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const stop = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			setIsRunning(false);
		}
	}, []);

	const start = useCallback(() => {
		if (delay === null || timerRef.current) return;
		if (immediate) callbackRef.current();
		timerRef.current = setInterval(() => callbackRef.current(), delay);
		setIsRunning(true);
	}, [delay, immediate]);

	const reset = useCallback(() => {
		stop();
		start();
	}, [stop, start]);

	useEffect(() => {
		if (autoStart) start();
		return stop;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delay, autoStart]);

	return { isRunning, start, stop, reset };
}
