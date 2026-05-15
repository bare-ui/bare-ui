import { createSignal, createEffect, onCleanup, type Accessor } from 'solid-js';

/**
 * Returns a reactive value throttled — updates at most once every `delay` ms.
 *
 * Pass the input as an accessor so Solid can track changes reactively.
 * Use for derived state from high-frequency events (scroll, mousemove) where you
 * want regular sampling rather than waiting for inactivity.
 *
 * @example
 * const throttledScroll = createThrottle(() => scrollY(), 100)
 */
export function createThrottle<T>(value: Accessor<T>, delay: number): Accessor<T> {
	const [throttled, setThrottled] = createSignal<T>(value() as T);
	let lastEmittedAt = 0;

	createEffect(() => {
		const v = value();
		const elapsed = Date.now() - lastEmittedAt;
		const remaining = Math.max(0, delay - elapsed);
		const id = setTimeout(() => {
			lastEmittedAt = Date.now();
			setThrottled(() => v as any);
		}, remaining);
		onCleanup(() => clearTimeout(id));
	});

	return throttled;
}

/**
 * Returns a stable, throttled callback that runs at most once per `delay` ms.
 * Fires on the leading edge; trailing calls are dropped.
 *
 * @example
 * const onScroll = createThrottledCallback(() => track(), 200)
 */
export function createThrottledCallback<Args extends unknown[]>(
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
