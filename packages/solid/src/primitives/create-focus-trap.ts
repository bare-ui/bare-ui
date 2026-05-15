import { createEffect, mergeProps, onCleanup, type Accessor } from 'solid-js';

export interface CreateFocusTrapOptions {
	/** Whether the trap is active */
	active?: boolean;
	/** Restore focus to the previously focused element when the trap deactivates */
	returnFocus?: boolean;
	/** Element to focus initially. Defaults to the first focusable child. */
	initialFocus?: Accessor<HTMLElement | null | undefined> | HTMLElement | null | undefined;
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
 * Pass `options` as a plain object or with getters to make `active` reactive:
 * `{ get active() { return isOpen() } }`
 *
 * @example
 * let dialogEl: HTMLDivElement | undefined;
 * createFocusTrap(() => dialogEl, { get active() { return isOpen() } })
 */
export function createFocusTrap(
	containerRef: Accessor<HTMLElement | null | undefined>,
	options: CreateFocusTrapOptions = {},
) {
	const merged = mergeProps({ active: true, returnFocus: true }, options);

	createEffect(() => {
		if (!merged.active) return;
		const container = containerRef();
		if (!container) return;

		const previouslyFocused = document.activeElement as HTMLElement | null;

		const initialFocus = merged.initialFocus;
		const target =
			typeof initialFocus === 'function'
				? initialFocus()
				: (initialFocus ?? getFocusable(container)[0] ?? container);
		target?.focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== 'Tab') return;

			const focusable = getFocusable(container!);
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

		document.addEventListener('keydown', handleKeyDown);

		onCleanup(() => {
			document.removeEventListener('keydown', handleKeyDown);
			if (merged.returnFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus();
			}
		});
	});
}
