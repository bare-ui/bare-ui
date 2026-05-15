import { createSignal, createEffect, onCleanup, type Accessor } from 'solid-js';

export interface ElementSize {
	width: number;
	height: number;
}

/**
 * Observes the size of the target element and returns a reactive accessor for its
 * current content-box dimensions.
 *
 * Pass `onResize` to react imperatively without depending on the returned signal.
 *
 * @example
 * let el: HTMLDivElement | undefined;
 * const size = createResizeObserver(() => el)
 * <p>Width: {size().width}</p>
 */
export function createResizeObserver<T extends HTMLElement>(
	target: Accessor<T | null | undefined>,
	onResize?: (size: ElementSize, entry: ResizeObserverEntry) => void,
): Accessor<ElementSize> {
	const [size, setSize] = createSignal<ElementSize>({ width: 0, height: 0 });

	createEffect(() => {
		const el = target();
		if (!el || typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const next = entry.contentRect
				? { width: entry.contentRect.width, height: entry.contentRect.height }
				: { width: el.offsetWidth, height: el.offsetHeight };
			setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
			onResize?.(next, entry);
		});

		observer.observe(el);
		onCleanup(() => observer.disconnect());
	});

	return size;
}
