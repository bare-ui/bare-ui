import { createSignal, createEffect, onCleanup, type Accessor } from 'solid-js';

export interface CreateIntersectionObserverOptions extends IntersectionObserverInit {
	/** Stop observing after the first intersection. */
	once?: boolean;
	/** Skip observation entirely while false. */
	enabled?: boolean;
}

/**
 * Observes intersection of the target element with its scroll container (or the viewport by default).
 *
 * Returns a reactive accessor for the latest `IntersectionObserverEntry`, or `null` before the
 * first callback. Use `entry()?.isIntersecting` for the common visibility-check case.
 *
 * Pass `options` with getters to make `enabled` reactive:
 * `{ get enabled() { return shouldObserve() } }`
 *
 * @example
 * let el: HTMLDivElement | undefined;
 * const entry = createIntersectionObserver(() => el, { threshold: 0.5, once: true })
 * const isVisible = () => entry()?.isIntersecting ?? false
 */
export function createIntersectionObserver<T extends Element>(
	target: Accessor<T | null | undefined>,
	options: CreateIntersectionObserverOptions = {},
): Accessor<IntersectionObserverEntry | null> {
	const { once = false, enabled = true, root, rootMargin, threshold } = options;
	const [entry, setEntry] = createSignal<IntersectionObserverEntry | null>(null);
	let frozen = false;

	createEffect(() => {
		if (!enabled || typeof IntersectionObserver === 'undefined') return;
		const el = target();
		if (!el || frozen) return;

		const observer = new IntersectionObserver(
			([next]) => {
				if (!next) return;
				setEntry(next);
				if (once && next.isIntersecting) {
					frozen = true;
					observer.disconnect();
				}
			},
			{ root, rootMargin, threshold },
		);

		observer.observe(el);
		onCleanup(() => observer.disconnect());
	});

	return entry;
}
