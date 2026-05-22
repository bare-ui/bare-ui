import { onMounted, onUnmounted, ref, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

export interface UseTimeoutOptions {
	/** Start the timeout immediately on mount. Defaults to `true`. */
	autoStart?: boolean;
}

export interface UseTimeoutResult {
	/** `true` while a scheduled timeout is pending. */
	isPending: Ref<boolean>;
	/** Cancel any pending timeout and start a new one (re-reads `delay`). */
	start: () => void;
	/** Cancel any pending timeout without firing the callback. */
	stop: () => void;
	/** Cancel any pending timeout and start a new one (alias for `start`). */
	reset: () => void;
}

/**
 * Schedules `callback` to fire once after `delay` ms.
 *
 * `delay` accepts a number, ref, or getter — the latest value is read each time
 * `start()` is called, so it stays in sync with reactive props.
 *
 * @example
 * const { start, stop, isPending } = useTimeout(() => (shown.value = false), 3000)
 *
 * @example
 * // Reactive delay driven by a prop:
 * const { start, stop } = useTimeout(open, () => props.delayDuration, { autoStart: false })
 */
export function useTimeout(
	callback: () => void,
	delay: MaybeRefOrGetter<number>,
	options: UseTimeoutOptions = {},
): UseTimeoutResult {
	const { autoStart = true } = options;
	const isPending = ref(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	function stop() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
			isPending.value = false;
		}
	}

	function start() {
		if (timer) clearTimeout(timer);
		isPending.value = true;
		timer = setTimeout(() => {
			timer = null;
			isPending.value = false;
			callback();
		}, toValue(delay));
	}

	onMounted(() => {
		if (autoStart) start();
	});

	onUnmounted(stop);

	return { isPending, start, stop, reset: start };
}
