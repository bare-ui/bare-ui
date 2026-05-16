import { reactive, watch, onUnmounted, type Ref } from 'vue';

export interface ElementSize {
	width: number;
	height: number;
}

/**
 * Observes the size of the element referenced by `targetRef` and returns its current
 * content-box dimensions as a reactive object.
 *
 * Pass `onResize` to react imperatively without triggering re-renders.
 *
 * @example
 * const el = ref<HTMLDivElement | null>(null)
 * const size = useResizeObserver(el)
 * // size.width, size.height
 */
export function useResizeObserver<T extends HTMLElement>(
	targetRef: Ref<T | null>,
	onResize?: (size: ElementSize, entry: ResizeObserverEntry) => void,
): ElementSize {
	const size = reactive<ElementSize>({ width: 0, height: 0 });
	let observer: ResizeObserver | null = null;

	function disconnect() {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	}

	watch(
		targetRef,
		(target) => {
			disconnect();
			if (!target || typeof ResizeObserver === 'undefined') return;

			observer = new ResizeObserver((entries) => {
				const entry = entries[0];
				if (!entry) return;
				const next =
					entry.contentRect ?
						{ width: entry.contentRect.width, height: entry.contentRect.height }
					:	{ width: target.offsetWidth, height: target.offsetHeight };
				if (size.width !== next.width || size.height !== next.height) {
					size.width = next.width;
					size.height = next.height;
				}
				onResize?.(next, entry);
			});

			observer.observe(target);
		},
		{ immediate: true, flush: 'post' },
	);

	onUnmounted(disconnect);

	return size;
}
