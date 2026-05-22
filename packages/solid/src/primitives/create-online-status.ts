import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';

/**
 * Returns a reactive accessor for whether the browser currently believes it has a network connection.
 *
 * Re-runs on `online` / `offline` events. SSR-safe — returns `true` on the server.
 * Note: `navigator.onLine` is heuristic; a `true` result only means the device
 * has *some* network interface, not that the internet is reachable.
 *
 * @example
 * const online = createOnlineStatus()
 * <Show when={!online()}><Banner>You're offline</Banner></Show>
 */
export function createOnlineStatus(): Accessor<boolean> {
	const getInitial = () => (typeof navigator === 'undefined' ? true : navigator.onLine);
	const [online, setOnline] = createSignal(getInitial());

	onMount(() => {
		if (typeof window === 'undefined') return;
		const update = () => setOnline(navigator.onLine);
		window.addEventListener('online', update);
		window.addEventListener('offline', update);
		onCleanup(() => {
			window.removeEventListener('online', update);
			window.removeEventListener('offline', update);
		});
	});

	return online;
}
