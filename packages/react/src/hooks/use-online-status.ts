import { useSyncExternalStore } from 'react';

function subscribe(notify: () => void) {
	if (typeof window === 'undefined') return () => {};
	window.addEventListener('online', notify);
	window.addEventListener('offline', notify);
	return () => {
		window.removeEventListener('online', notify);
		window.removeEventListener('offline', notify);
	};
}

function getSnapshot(): boolean {
	if (typeof navigator === 'undefined') return true;
	return navigator.onLine;
}

function getServerSnapshot(): boolean {
	return true;
}

/**
 * Returns whether the browser currently believes it has a network connection.
 *
 * Re-renders on `online` / `offline` events. SSR-safe — returns `true` on the server.
 * Note: `navigator.onLine` is heuristic; a `true` result only means the device
 * has *some* network interface, not that the internet is reachable.
 *
 * @example
 * const online = useOnlineStatus()
 * if (!online) return <Banner>You're offline</Banner>
 */
export function useOnlineStatus(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
