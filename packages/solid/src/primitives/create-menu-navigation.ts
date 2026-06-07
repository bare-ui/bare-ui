import { createEffect, mergeProps, onCleanup, type Accessor } from 'solid-js';

const MENU_ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
const TYPEAHEAD_RESET_MS = 500;

export interface CreateMenuNavigationOptions {
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
 * Pass `options` with a getter to make `open` reactive:
 * `{ get open() { return isOpen() }, onClose: () => setOpen(false) }`
 *
 * @example
 * let menuEl: HTMLDivElement | undefined;
 * const { onKeyDown } = createMenuNavigation(() => menuEl, {
 *   get open() { return open() },
 *   onClose: () => setOpen(false),
 * });
 * return <div ref={menuEl} role="menu" onKeyDown={onKeyDown}>{children}</div>
 */
export function createMenuNavigation(
	menuRef: Accessor<HTMLElement | null | undefined>,
	options: CreateMenuNavigationOptions,
) {
	const merged = mergeProps({ focusFirstOnOpen: true }, options);
	let previousFocus: HTMLElement | null = null;
	let skipRestore = false;
	const typeahead = { buffer: '', time: 0 };

	createEffect(() => {
		if (!merged.open) return;
		const menu = menuRef();
		if (!menu) return;

		previousFocus = document.activeElement as HTMLElement | null;
		const items = getItems(menu);
		if (items.length > 0) {
			applyRoving(items, 0);
			if (merged.focusFirstOnOpen) items[0].focus();
		}

		onCleanup(() => {
			// On close, return focus to the element that opened the menu — unless the
			// user Tabbed out (focus should keep moving forward).
			if (skipRestore) {
				skipRestore = false;
				return;
			}
			const prev = previousFocus;
			const active = document.activeElement;
			const focusLeftWithMenu = active === document.body || menu.contains(active);
			if (prev && focusLeftWithMenu && typeof prev.focus === 'function') prev.focus();
		});
	});

	function focusIndex(items: HTMLElement[], index: number) {
		const clamped = (index + items.length) % items.length;
		applyRoving(items, clamped);
		items[clamped].focus();
	}

	function onKeyDown(e: KeyboardEvent) {
		const menu = menuRef();
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
				skipRestore = true;
				merged.onClose?.();
				break;
			default: {
				// Typeahead: focus the next item whose label starts with the typed run.
				// Space is reserved for item activation, so it never starts a search.
				if (e.key.length !== 1 || e.key === ' ' || e.metaKey || e.ctrlKey || e.altKey) break;
				const now = Date.now();
				const buffer = now - typeahead.time > TYPEAHEAD_RESET_MS ? e.key : typeahead.buffer + e.key;
				typeahead.buffer = buffer;
				typeahead.time = now;
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
	}

	return { onKeyDown };
}
