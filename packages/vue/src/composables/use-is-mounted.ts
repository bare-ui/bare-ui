import { onMounted, readonly, ref, type Ref } from 'vue';

/**
 * Tracks whether the component has mounted on the client.
 *
 * Returns `false` during server render and the first client (hydration) render,
 * then flips to `true` after mount — `onMounted` never runs on the server. Use it
 * to gate client-only output, most importantly `<Teleport>`, so the server markup
 * and the first client render agree and hydration stays mismatch-free.
 *
 * @example
 * const mounted = useIsMounted()
 * // <Teleport v-if="mounted" to="body">…</Teleport>
 */
export function useIsMounted(): Readonly<Ref<boolean>> {
	const mounted = ref(false);
	onMounted(() => {
		mounted.value = true;
	});
	return readonly(mounted);
}
