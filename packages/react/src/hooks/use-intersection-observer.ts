import { useEffect, useRef, useState, type RefObject } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
	/** Stop observing after the first intersection. */
	once?: boolean;
	/** Skip observation entirely while false. */
	enabled?: boolean;
}

/**
 * Observes intersection of `ref` with its scroll container (or the viewport by default).
 *
 * Returns the latest `IntersectionObserverEntry`, or `null` before the first callback.
 * Use `entry.isIntersecting` for the common visibility-check case.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const entry = useIntersectionObserver(ref, { threshold: 0.5, once: true })
 * const isVisible = entry?.isIntersecting ?? false
 */
export function useIntersectionObserver<T extends Element>(
	ref: RefObject<T | null>,
	options: UseIntersectionObserverOptions = {},
): IntersectionObserverEntry | null {
	const { once = false, enabled = true, root, rootMargin, threshold } = options;
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const frozen = useRef(false);

	useEffect(() => {
		if (!enabled || typeof IntersectionObserver === 'undefined') return;
		const target = ref.current;
		if (!target) return;
		if (frozen.current) return;

		const observer = new IntersectionObserver(
			([next]) => {
				if (!next) return;
				setEntry(next);
				if (once && next.isIntersecting) {
					frozen.current = true;
					observer.disconnect();
				}
			},
			{ root, rootMargin, threshold },
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, [ref, enabled, once, root, rootMargin, threshold]);

	return entry;
}
