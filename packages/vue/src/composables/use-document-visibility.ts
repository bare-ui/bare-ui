import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Returns the current `document.visibilityState` (`'visible'` | `'hidden'`),
 * updating when it changes.
 *
 * Use to pause animations, polling, or background work when the tab is hidden.
 * SSR-safe — returns `'visible'` on the server.
 *
 * @example
 * const visibility = useDocumentVisibility()
 * watch(visibility, (state) => {
 *   if (state === 'hidden') pausePolling()
 *   else resumePolling()
 * })
 */
export function useDocumentVisibility(): Ref<DocumentVisibilityState> {
	const state = ref<DocumentVisibilityState>(
		typeof document === 'undefined' ? 'visible' : document.visibilityState,
	);

	function handler() {
		state.value = document.visibilityState;
	}

	onMounted(() => {
		state.value = document.visibilityState;
		document.addEventListener('visibilitychange', handler);
	});

	onUnmounted(() => {
		document.removeEventListener('visibilitychange', handler);
	});

	return state;
}
