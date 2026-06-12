import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export type Direction = 'ltr' | 'rtl';

/**
 * Reads the resolved text direction of an element synchronously.
 *
 * Resolution order: the nearest ancestor (or the element itself) carrying a
 * `dir` attribute wins; otherwise the computed `direction` style is consulted
 * (covers `direction: rtl` set purely via CSS). Defaults to `'ltr'` on the
 * server or when nothing is found.
 *
 * Use this inside event handlers where the direction must be known at the exact
 * moment of interaction (pointer math, arrow keys). For values consumed during
 * render, use {@link useDirection} instead.
 *
 * @example
 * function onKeyDown(e: KeyboardEvent) {
 *   const rtl = getDirection(e.currentTarget as Element) === 'rtl'
 *   // swap ArrowLeft/ArrowRight semantics when rtl
 * }
 */
export function getDirection(el: Element | null | undefined): Direction {
	if (!el || typeof window === 'undefined') return 'ltr';
	// A `dir` attribute is authoritative and works in jsdom (where computed
	// `direction` does not reflect inherited `dir`). Fall back to computed style
	// for direction set purely through CSS.
	const dirAttr = el.closest('[dir]')?.getAttribute('dir');
	if (dirAttr === 'rtl' || dirAttr === 'ltr') return dirAttr;
	const computed = typeof getComputedStyle === 'function' ? getComputedStyle(el).direction : '';
	return computed === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * Reactively tracks the text direction of `ref`'s element for use during
 * render. Re-reads on mount and whenever a `dir` attribute changes on the
 * nearest direction host.
 *
 * For event-time reads, prefer {@link getDirection}, which is always current.
 */
export function useDirection(elRef: Ref<Element | null>): Ref<Direction> {
	const dir = ref<Direction>('ltr');
	let observer: MutationObserver | null = null;

	onMounted(() => {
		const el = elRef.value;
		if (!el) return;
		const read = () => { dir.value = getDirection(el); };
		read();

		const host = el.closest('[dir]') ?? document.documentElement;
		observer = new MutationObserver(read);
		observer.observe(host, { attributes: true, attributeFilter: ['dir'] });
	});

	onUnmounted(() => {
		observer?.disconnect();
		observer = null;
	});

	return dir;
}
