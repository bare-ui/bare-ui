import { ref, watch, onUnmounted, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

/**
 * Returns `source` throttled — updates at most once every `delay` ms.
 *
 * Use for derived state from high-frequency events (scroll, mousemove) where you
 * want regular sampling rather than waiting for inactivity.
 *
 * @example
 * const throttledScroll = useThrottle(() => scrollY.value, 100)
 */
export function useThrottle<T>(source: MaybeRefOrGetter<T>, delay: number): Ref<T> {
	const throttled = ref(toValue(source)) as Ref<T>;
	let lastEmittedAt = 0;
	let timer: ReturnType<typeof setTimeout> | null = null;

	watch(
		() => toValue(source),
		(value) => {
			if (timer) clearTimeout(timer);
			const elapsed = Date.now() - lastEmittedAt;
			const remaining = Math.max(0, delay - elapsed);
			timer = setTimeout(() => {
				lastEmittedAt = Date.now();
				throttled.value = value;
			}, remaining);
		},
	);

	onUnmounted(() => {
		if (timer) clearTimeout(timer);
	});

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
	let lastInvokedAt = 0;

	return (...args: Args) => {
		const now = Date.now();
		if (now - lastInvokedAt >= delay) {
			lastInvokedAt = now;
			callback(...args);
		}
	};
}
