import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';

export interface CreateIntervalOptions {
	/** Start ticking immediately on mount. Defaults to `true`. */
	autoStart?: boolean;
	/** Fire `callback` once immediately on start, then on each interval. Defaults to `false`. */
	immediate?: boolean;
}

export interface CreateIntervalResult {
	/** Reactive accessor — `true` while the interval is actively ticking. */
	isRunning: Accessor<boolean>;
	/** Begin ticking. No-op if already running or `delay` is `null`. */
	start: () => void;
	/** Stop ticking without firing. */
	stop: () => void;
	/** Stop then start (resets the next-tick countdown). */
	reset: () => void;
}

/**
 * Calls `callback` repeatedly every `delay` ms.
 *
 * `delay` accepts a number, `null`, or accessor — read each time `start()` is
 * called. Pass `null` (or an accessor that returns `null`) to pause.
 *
 * @example
 * const { stop, isRunning } = createInterval(() => setNow(Date.now()), 1000)
 */
export function createInterval(
	callback: () => void,
	delay: number | null | Accessor<number | null>,
	options: CreateIntervalOptions = {},
): CreateIntervalResult {
	const { autoStart = true, immediate = false } = options;
	const [isRunning, setIsRunning] = createSignal(false);
	let timerId: ReturnType<typeof setInterval> | null = null;

	const getDelay = () => (typeof delay === 'function' ? delay() : delay);

	const stop = () => {
		if (timerId !== null) {
			clearInterval(timerId);
			timerId = null;
			setIsRunning(false);
		}
	};

	const start = () => {
		const d = getDelay();
		if (d === null || timerId !== null) return;
		if (immediate) callback();
		timerId = setInterval(() => callback(), d);
		setIsRunning(true);
	};

	const reset = () => {
		stop();
		start();
	};

	onMount(() => {
		if (autoStart) start();
	});

	onCleanup(stop);

	return { isRunning, start, stop, reset };
}
