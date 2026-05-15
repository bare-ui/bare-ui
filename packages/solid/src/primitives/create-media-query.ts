import { createSignal, onMount, onCleanup, type Accessor } from 'solid-js';

/**
 * Returns a reactive accessor for whether the given CSS media query currently matches.
 *
 * Re-runs when the match state changes. SSR-safe — returns `false` on the server.
 *
 * @example
 * const isMobile = createMediaQuery('(max-width: 640px)')
 */
export function createMediaQuery(query: string): Accessor<boolean> {
	const getInitialValue = () => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
		return window.matchMedia(query).matches;
	};

	const [matches, setMatches] = createSignal(getInitialValue());

	onMount(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
		const list = window.matchMedia(query);
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		list.addEventListener('change', handler);
		onCleanup(() => list.removeEventListener('change', handler));
	});

	return matches;
}
