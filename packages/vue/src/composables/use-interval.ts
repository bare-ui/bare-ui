import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export interface UseIntervalOptions {
	/** Start ticking immediately on mount. Defaults to `true`. */
	autoStart?: boolean;
	/** Fire `callback` once immediately on start, then on each interval. Defaults to `false`. */
	immediate?: boolean;
}

export interface UseIntervalResult {
	/** `true` while the interval is actively ticking. */
	isRunning: Ref<boolean>;
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
 * Pass `delay = null` to pause without unmounting.
 *
 * @example
 * const { stop, isRunning } = useInterval(() => (now.value = Date.now()), 1000)
 */
export function useInterval(
	callback: () => void,
	delay: number | null,
	options: UseIntervalOptions = {},
): UseIntervalResult {
	const { autoStart = true, immediate = false } = options;
	const isRunning = ref(false);
	let timer: ReturnType<typeof setInterval> | null = null;

	function stop() {
		if (timer) {
			clearInterval(timer);
			timer = null;
			isRunning.value = false;
		}
	}

	function start() {
		if (delay === null || timer) return;
		if (immediate) callback();
		timer = setInterval(() => callback(), delay);
		isRunning.value = true;
	}

	function reset() {
		stop();
		start();
	}

	onMounted(() => {
		if (autoStart) start();
	});

	onUnmounted(stop);

	return { isRunning, start, stop, reset };
}
