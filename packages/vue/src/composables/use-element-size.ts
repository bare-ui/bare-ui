import { type Ref } from 'vue';

import { useResizeObserver, type ElementSize } from './use-resize-observer';

/**
 * Returns the live content-box size of the element referenced by `targetRef`.
 *
 * Thin alias over {@link useResizeObserver} — same behaviour, name optimized for
 * the common "I just want width/height" case.
 *
 * @example
 * const el = ref<HTMLDivElement | null>(null)
 * const size = useElementSize(el)
 * // size.width, size.height
 */
export function useElementSize<T extends HTMLElement>(targetRef: Ref<T | null>): ElementSize {
	return useResizeObserver(targetRef);
}
