import { useSyncExternalStore } from 'react';

function subscribe(query: string) {
	return (notify: () => void) => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
		const list = window.matchMedia(query);
		list.addEventListener('change', notify);
		return () => list.removeEventListener('change', notify);
	};
}

function getSnapshot(query: string) {
	return () => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
		return window.matchMedia(query).matches;
	};
}

function getServerSnapshot() {
	return false;
}

/**
 * Returns whether the given CSS media query currently matches.
 *
 * Re-renders when the match state changes. SSR-safe — returns `false` on the server.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 640px)')
 */
export function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(subscribe(query), getSnapshot(query), getServerSnapshot);
}
