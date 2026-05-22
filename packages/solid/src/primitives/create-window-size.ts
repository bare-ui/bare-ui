import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';

export interface WindowSize {
	width: number;
	height: number;
}

/**
 * Returns a reactive accessor for the current `window.innerWidth` / `innerHeight`.
 *
 * Re-runs on `resize` and `orientationchange`. SSR-safe — returns `{0, 0}` on the server
 * and until mount.
 *
 * @example
 * const size = createWindowSize()
 * const isMobile = () => size().width < 640
 */
export function createWindowSize(): Accessor<WindowSize> {
	const getInitial = (): WindowSize =>
		typeof window === 'undefined' ? { width: 0, height: 0 } : { width: window.innerWidth, height: window.innerHeight };

	const [size, setSize] = createSignal<WindowSize>(getInitial());

	onMount(() => {
		if (typeof window === 'undefined') return;
		const update = () => {
			const next = { width: window.innerWidth, height: window.innerHeight };
			setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
		};
		window.addEventListener('resize', update);
		window.addEventListener('orientationchange', update);
		onCleanup(() => {
			window.removeEventListener('resize', update);
			window.removeEventListener('orientationchange', update);
		});
	});

	return size;
}
