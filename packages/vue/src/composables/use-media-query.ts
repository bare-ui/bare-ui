import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

/**
 * Returns whether the given CSS media query currently matches.
 *
 * Re-renders when the match state changes. SSR-safe — returns `false` on the server.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 640px)')
 */
export function useMediaQuery(query: string): Ref<boolean> {
	const matches = ref(false);
	let list: MediaQueryList | null = null;

	function handler(event: MediaQueryListEvent) {
		matches.value = event.matches;
	}

	function attach() {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
		list = window.matchMedia(query);
		matches.value = list.matches;
		list.addEventListener('change', handler);
	}

	function detach() {
		if (!list) return;
		list.removeEventListener('change', handler);
		list = null;
	}

	onMounted(attach);
	onUnmounted(detach);

	watch(
		() => query,
		() => {
			detach();
			attach();
		},
	);

	return matches;
}
