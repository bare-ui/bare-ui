import { useState, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export type Direction = 'ltr' | 'rtl';

/**
 * Reads the resolved text direction of an element, synchronously.
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
 * function onKeyDown(e: React.KeyboardEvent) {
 *   const rtl = getDirection(e.currentTarget) === 'rtl'
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

/** `true` when the element resolves to right-to-left. */
export function isRtl(el: Element | null | undefined): boolean {
	return getDirection(el) === 'rtl';
}

/**
 * Reactively tracks the text direction of `ref`'s element for use during render
 * (e.g. mirroring inline `insetInlineStart`/`transform` positioning). Re-reads
 * on mount and whenever a `dir` attribute changes on the nearest direction host.
 *
 * For event-time reads, prefer {@link getDirection}, which avoids the extra
 * state and is always current.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const dir = useDirection(ref)
 * const style = { insetInlineStart: dir === 'rtl' ? `${100 - pct}%` : `${pct}%` }
 */
export function useDirection(ref: RefObject<Element | null>): Direction {
	const [dir, setDir] = useState<Direction>('ltr');

	useIsomorphicLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const read = () => setDir(getDirection(el));
		read();

		// Observe the host that actually carries `dir` (or the document root, so a
		// later `dir` flip anywhere above is still picked up).
		const host = el.closest('[dir]') ?? document.documentElement;
		const observer = new MutationObserver(read);
		observer.observe(host, { attributes: true, attributeFilter: ['dir'] });
		return () => observer.disconnect();
	}, [ref]);

	return dir;
}
