import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Returns whether the browser currently believes it has a network connection.
 *
 * Updates on `online` / `offline` events. SSR-safe — returns `true` on the server.
 * Note: `navigator.onLine` is heuristic; a `true` result only means the device
 * has *some* network interface, not that the internet is reachable.
 *
 * @example
 * const online = useOnlineStatus()
 * <Banner v-if="!online">You're offline</Banner>
 */
export function useOnlineStatus(): Ref<boolean> {
	const online = ref<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);

	function update() {
		online.value = navigator.onLine;
	}

	onMounted(() => {
		online.value = navigator.onLine;
		window.addEventListener('online', update);
		window.addEventListener('offline', update);
	});

	onUnmounted(() => {
		window.removeEventListener('online', update);
		window.removeEventListener('offline', update);
	});

	return online;
}
