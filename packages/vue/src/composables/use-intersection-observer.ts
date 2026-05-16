import { ref, watch, onUnmounted, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
	/** Stop observing after the first intersection. */
	once?: boolean;
	/** Skip observation entirely while false. */
	enabled?: MaybeRefOrGetter<boolean>;
}

/**
 * Observes intersection of `targetRef` with its scroll container (or the viewport by default).
 *
 * Returns the latest `IntersectionObserverEntry`, or `null` before the first callback.
 * Use `entry.isIntersecting` for the common visibility-check case.
 *
 * @example
 * const el = ref<HTMLDivElement | null>(null)
 * const entry = useIntersectionObserver(el, { threshold: 0.5, once: true })
 * const isVisible = computed(() => entry.value?.isIntersecting ?? false)
 */
export function useIntersectionObserver<T extends Element>(
	targetRef: Ref<T | null>,
	options: UseIntersectionObserverOptions = {},
): Ref<IntersectionObserverEntry | null> {
	const { once = false, root, rootMargin, threshold } = options;
	const entry = ref<IntersectionObserverEntry | null>(null);
	let observer: IntersectionObserver | null = null;
	let frozen = false;

	function disconnect() {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	}

	function attach(target: T) {
		if (typeof IntersectionObserver === 'undefined' || frozen) return;
		observer = new IntersectionObserver(
			([next]) => {
				if (!next) return;
				entry.value = next;
				if (once && next.isIntersecting) {
					frozen = true;
					disconnect();
				}
			},
			{ root, rootMargin, threshold },
		);
		observer.observe(target);
	}

	watch(
		[targetRef, () => toValue(options.enabled) ?? true],
		([target, enabled]) => {
			disconnect();
			if (enabled && target) attach(target);
		},
		{ immediate: true, flush: 'post' },
	);

	onUnmounted(disconnect);

	return entry;
}
