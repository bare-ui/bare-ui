import { useEffect, type RefObject } from 'react';

export interface UseFocusTrapOptions {
	/** Whether the trap is active */
	active?: boolean;
	/** Restore focus to the previously focused element when the trap deactivates */
	returnFocus?: boolean;
	/** Element to focus initially. Defaults to the first focusable child. */
	initialFocus?: RefObject<HTMLElement | null> | HTMLElement | null;
	/**
	 * Cycle Tab/Shift+Tab within the container. Set `false` for non-modal surfaces
	 * (e.g. a popover) that should still move focus in on open and restore it on
	 * close, but let Tab leave naturally.
	 * @default true
	 */
	trap?: boolean;
}

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'embed',
	'[contenteditable]',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
		(el) => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null,
	);
}

/**
 * Traps keyboard focus inside the given container while active.
 *
 * Cycles Tab / Shift+Tab between the first and last focusable descendants. On activation,
 * focus moves to `initialFocus` (or the first focusable child). On deactivation, focus
 * returns to whatever was focused before, unless `returnFocus` is false.
 *
 * @example
 * const dialogRef = useRef<HTMLDivElement>(null)
 * useFocusTrap(dialogRef, { active: open })
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, options: UseFocusTrapOptions = {}) {
	const { active = true, returnFocus = true, initialFocus, trap = true } = options;

	useEffect(() => {
		if (!active) return;
		const container = containerRef.current;
		if (!container) return;

		const previouslyFocused = document.activeElement as HTMLElement | null;

		const target =
			initialFocus && 'current' in initialFocus
				? initialFocus.current
				: (initialFocus as HTMLElement | null) ?? getFocusable(container)[0] ?? container;
		target?.focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== 'Tab') return;
			if (!container) return;

			const focusable = getFocusable(container);
			if (focusable.length === 0) {
				event.preventDefault();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const activeEl = document.activeElement as HTMLElement | null;

			if (event.shiftKey && activeEl === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && activeEl === last) {
				event.preventDefault();
				first.focus();
			}
		}

		if (trap) document.addEventListener('keydown', handleKeyDown);

		return () => {
			if (trap) document.removeEventListener('keydown', handleKeyDown);
			if (returnFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus();
			}
		};
	}, [active, containerRef, returnFocus, initialFocus, trap]);
}
