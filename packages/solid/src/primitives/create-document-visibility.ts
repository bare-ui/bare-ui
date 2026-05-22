import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';

/**
 * Returns a reactive accessor for `document.visibilityState` (`'visible'` | `'hidden'`).
 *
 * Use to pause animations, polling, or background work when the tab is hidden.
 * SSR-safe — returns `'visible'` on the server.
 *
 * @example
 * const visibility = createDocumentVisibility()
 * createEffect(() => {
 *   if (visibility() === 'hidden') pausePolling()
 *   else resumePolling()
 * })
 */
export function createDocumentVisibility(): Accessor<DocumentVisibilityState> {
	const getInitial = (): DocumentVisibilityState =>
		typeof document === 'undefined' ? 'visible' : document.visibilityState;

	const [visibility, setVisibility] = createSignal<DocumentVisibilityState>(getInitial());

	onMount(() => {
		if (typeof document === 'undefined') return;
		const handler = () => setVisibility(document.visibilityState);
		document.addEventListener('visibilitychange', handler);
		onCleanup(() => document.removeEventListener('visibilitychange', handler));
	});

	return visibility;
}
