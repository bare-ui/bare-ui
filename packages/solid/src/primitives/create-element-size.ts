import { type Accessor } from 'solid-js';

import { createResizeObserver, type ElementSize } from './create-resize-observer';

/**
 * Returns a reactive accessor for the live content-box size of the element.
 *
 * Thin alias over {@link createResizeObserver} — same behaviour, name optimized for
 * the common "I just want width/height" case.
 *
 * @example
 * let el: HTMLDivElement | undefined;
 * const size = createElementSize(() => el)
 * <p>Width: {size().width}</p>
 */
export function createElementSize<T extends HTMLElement>(
	target: Accessor<T | null | undefined>,
): Accessor<ElementSize> {
	return createResizeObserver(target);
}
