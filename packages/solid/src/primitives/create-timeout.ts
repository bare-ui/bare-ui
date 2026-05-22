import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';

export interface CreateTimeoutOptions {
	/** Start the timeout immediately on mount. Defaults to `true`. */
	autoStart?: boolean;
}

export interface CreateTimeoutResult {
	/** Reactive accessor — `true` while a scheduled timeout is pending. */
	isPending: Accessor<boolean>;
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
 * `delay` accepts a number or accessor — the latest value is read each time
 * `start()` is called, so it stays in sync with reactive props.
 *
 * Returns imperative controls so the timeout can be paused, cancelled, or restarted.
 *
 * @example
 * const { start, stop, isPending } = createTimeout(() => setShown(false), 3000)
 *
 * @example
 * // Reactive delay driven by a prop:
 * const { start, stop } = createTimeout(open, () => props.delayDuration, { autoStart: false })
 */
export function createTimeout(
	callback: () => void,
	delay: number | Accessor<number>,
	options: CreateTimeoutOptions = {},
): CreateTimeoutResult {
	const { autoStart = true } = options;
	const [isPending, setIsPending] = createSignal(false);
	let timerId: ReturnType<typeof setTimeout> | null = null;

	const getDelay = () => (typeof delay === 'function' ? delay() : delay);

	const stop = () => {
		if (timerId !== null) {
			clearTimeout(timerId);
			timerId = null;
			setIsPending(false);
		}
	};

	const start = () => {
		if (timerId !== null) clearTimeout(timerId);
		setIsPending(true);
		timerId = setTimeout(() => {
			timerId = null;
			setIsPending(false);
			callback();
		}, getDelay());
	};

	onMount(() => {
		if (autoStart) start();
	});

	onCleanup(stop);

	return { isPending, start, stop, reset: start };
}
