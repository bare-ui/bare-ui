import { useSyncExternalStore } from 'react';

function subscribe(notify: () => void) {
	if (typeof document === 'undefined') return () => {};
	document.addEventListener('visibilitychange', notify);
	return () => document.removeEventListener('visibilitychange', notify);
}

function getSnapshot(): DocumentVisibilityState {
	if (typeof document === 'undefined') return 'visible';
	return document.visibilityState;
}

function getServerSnapshot(): DocumentVisibilityState {
	return 'visible';
}

/**
 * Returns the current `document.visibilityState` (`'visible'` | `'hidden'`),
 * re-rendering when it changes.
 *
 * Use to pause animations, polling, or background work when the tab is hidden.
 * SSR-safe — returns `'visible'` on the server.
 *
 * @example
 * const visibility = useDocumentVisibility()
 * useEffect(() => {
 *   if (visibility === 'hidden') pausePolling()
 *   else resumePolling()
 * }, [visibility])
 */
export function useDocumentVisibility(): DocumentVisibilityState {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
