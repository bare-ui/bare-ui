import { useSyncExternalStore } from 'react';

export interface WindowSize {
	width: number;
	height: number;
}

function subscribe(notify: () => void) {
	if (typeof window === 'undefined') return () => {};
	window.addEventListener('resize', notify);
	window.addEventListener('orientationchange', notify);
	return () => {
		window.removeEventListener('resize', notify);
		window.removeEventListener('orientationchange', notify);
	};
}

let cachedSize: WindowSize | null = null;

function getSnapshot(): WindowSize {
	if (typeof window === 'undefined') return { width: 0, height: 0 };
	const next = { width: window.innerWidth, height: window.innerHeight };
	if (cachedSize && cachedSize.width === next.width && cachedSize.height === next.height) {
		return cachedSize;
	}
	cachedSize = next;
	return next;
}

function getServerSnapshot(): WindowSize {
	return { width: 0, height: 0 };
}

/**
 * Returns the current `window.innerWidth` / `innerHeight`.
 *
 * Re-renders on `resize` and `orientationchange`. SSR-safe — returns `{0, 0}`
 * until hydration.
 *
 * @example
 * const { width } = useWindowSize()
 * const isMobile = width < 640
 */
export function useWindowSize(): WindowSize {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
