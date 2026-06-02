import { useCallback, useRef, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

const MENU_ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
const TYPEAHEAD_RESET_MS = 500;

export interface UseMenuNavigationOptions {
	/** Whether the menu is open (focus moves in on open, restores on close). */
	open: boolean;
	/** Close the menu (called on Tab, which moves focus out of the menu). */
	onClose?: () => void;
	/** Move focus to the first item when the menu opens. @default true */
	focusFirstOnOpen?: boolean;
}

function getItems(menu: HTMLElement): HTMLElement[] {
	return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
		(el) => el.getAttribute('aria-disabled') !== 'true' && !el.hasAttribute('disabled'),
	);
}

// Roving tabindex: exactly one item is tabbable (0); the rest are -1. Driven by
// keyboard focus so Tab exits the menu rather than walking every item.
function applyRoving(items: HTMLElement[], activeIndex: number) {
	items.forEach((item, i) => {
		item.tabIndex = i === activeIndex ? 0 : -1;
	});
}

/**
 * Wires ARIA menu keyboard navigation onto a `role="menu"` container whose items
 * carry `role="menuitem"` (or the checkbox/radio variants) — including
 * consumer-authored items. Manages roving tabindex, Arrow/Home/End/typeahead
 * movement, focus-into-menu on open, and focus-restore to the trigger on close.
 *
 * Returns an `onKeyDown` handler to spread onto the menu container.
 *
 * @example
 * const menuRef = useRef<HTMLDivElement>(null)
 * const { onKeyDown } = useMenuNavigation(menuRef, { open, onClose: () => setOpen(false) })
 * return <div ref={menuRef} role="menu" onKeyDown={onKeyDown}>{children}</div>
 */
export function useMenuNavigation(menuRef: RefObject<HTMLElement | null>, options: UseMenuNavigationOptions) {
	const { open, onClose, focusFirstOnOpen = true } = options;
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const skipRestoreRef = useRef(false);
	const typeaheadRef = useRef<{ buffer: string; time: number }>({ buffer: '', time: 0 });

	useIsomorphicLayoutEffect(() => {
		if (!open) return;
		const menu = menuRef.current;
		if (!menu) return;

		previousFocusRef.current = document.activeElement as HTMLElement | null;
		const items = getItems(menu);
		if (items.length > 0) {
			applyRoving(items, 0);
			if (focusFirstOnOpen) items[0].focus();
		}

		return () => {
			// On close, return focus to the element that opened the menu — unless the
			// user Tabbed out (focus should keep moving forward).
			if (skipRestoreRef.current) {
				skipRestoreRef.current = false;
				return;
			}
			const prev = previousFocusRef.current;
			const active = document.activeElement;
			const focusLeftWithMenu = active === document.body || menu.contains(active);
			if (prev && focusLeftWithMenu && typeof prev.focus === 'function') prev.focus();
		};
	}, [open, menuRef, focusFirstOnOpen]);

	const focusIndex = useCallback(
		(items: HTMLElement[], index: number) => {
			const clamped = (index + items.length) % items.length;
			applyRoving(items, clamped);
			items[clamped].focus();
		},
		[],
	);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const menu = menuRef.current;
			if (!menu) return;
			const items = getItems(menu);
			if (items.length === 0) return;
			const currentIndex = items.indexOf(document.activeElement as HTMLElement);

			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					focusIndex(items, currentIndex < 0 ? 0 : currentIndex + 1);
					break;
				case 'ArrowUp':
					e.preventDefault();
					focusIndex(items, currentIndex < 0 ? items.length - 1 : currentIndex - 1);
					break;
				case 'Home':
					e.preventDefault();
					focusIndex(items, 0);
					break;
				case 'End':
					e.preventDefault();
					focusIndex(items, items.length - 1);
					break;
				case 'Tab':
					// Tab closes the menu and lets focus continue to the next element.
					skipRestoreRef.current = true;
					onClose?.();
					break;
				default: {
					// Typeahead: focus the next item whose label starts with the typed run.
					// Space is reserved for item activation, so it never starts a search.
					if (e.key.length !== 1 || e.key === ' ' || e.metaKey || e.ctrlKey || e.altKey) break;
					const now = Date.now();
					const prev = typeaheadRef.current;
					const buffer = now - prev.time > TYPEAHEAD_RESET_MS ? e.key : prev.buffer + e.key;
					typeaheadRef.current = { buffer, time: now };
					const needle = buffer.toLowerCase();
					const start = currentIndex < 0 ? 0 : currentIndex + 1;
					const ordered = [...items.slice(start), ...items.slice(0, start)];
					const match = ordered.find((item) => (item.textContent ?? '').trim().toLowerCase().startsWith(needle));
					if (match) {
						e.preventDefault();
						focusIndex(items, items.indexOf(match));
					}
				}
			}
		},
		[menuRef, onClose, focusIndex],
	);

	return { onKeyDown };
}
