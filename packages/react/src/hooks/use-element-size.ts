import { type RefObject } from 'react';

import { useResizeObserver, type ElementSize } from './use-resize-observer';

/**
 * Returns the live content-box size of the element referenced by `ref`.
 *
 * Thin alias over {@link useResizeObserver} — same behaviour, name optimized for
 * the common "I just want width/height" case.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { width, height } = useElementSize(ref)
 */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): ElementSize {
	return useResizeObserver(ref);
}
