import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ElementSize {
	width: number;
	height: number;
}

/**
 * Observes the size of the element referenced by `ref` and returns its current
 * content-box dimensions.
 *
 * Pass `onResize` to react imperatively without triggering a re-render.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { width, height } = useResizeObserver(ref)
 */
export function useResizeObserver<T extends HTMLElement>(
	ref: RefObject<T | null>,
	onResize?: (size: ElementSize, entry: ResizeObserverEntry) => void,
): ElementSize {
	const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });
	const callbackRef = useRef(onResize);
	useEffect(() => {
		callbackRef.current = onResize;
	}, [onResize]);

	useEffect(() => {
		const target = ref.current;
		if (!target || typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const next = entry.contentRect
				? { width: entry.contentRect.width, height: entry.contentRect.height }
				: { width: target.offsetWidth, height: target.offsetHeight };
			setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
			callbackRef.current?.(next, entry);
		});

		observer.observe(target);
		return () => observer.disconnect();
	}, [ref]);

	return size;
}
