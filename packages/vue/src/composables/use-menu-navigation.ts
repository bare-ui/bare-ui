import { watch, onMounted, onUnmounted, toValue, type Ref, type MaybeRefOrGetter } from 'vue';

const MENU_ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
const TYPEAHEAD_RESET_MS = 500;

export interface UseMenuNavigationOptions {
	/** Whether the menu is open (focus moves in on open, restores on close). */
	open: MaybeRefOrGetter<boolean>;
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

function applyRoving(items: HTMLElement[], activeIndex: number) {
	items.forEach((item, i) => {
		item.tabIndex = i === activeIndex ? 0 : -1;
	});
}

/**
 * Wires ARIA menu keyboard navigation onto a `role="menu"` container whose items
 * carry `role="menuitem"` (or the checkbox/radio variants). Manages roving tabindex,
 * Arrow/Home/End/typeahead movement, focus-into-menu on open, and focus-restore to
 * the trigger on close.
 *
 * Returns an `onKeyDown` handler to wire onto the menu container via `@keydown`.
 *
 * @example
 * const menuRef = ref<HTMLDivElement | null>(null)
 * const { onKeyDown } = useMenuNavigation(menuRef, { open: () => ctx.open, onClose: () => ctx.setOpen(false) })
 * // <div ref="menuRef" role="menu" @keydown="onKeyDown">...</div>
 */
export function useMenuNavigation(
	menuRef: Ref<HTMLElement | null>,
	options: UseMenuNavigationOptions,
) {
	const { onClose, focusFirstOnOpen = true } = options;

	let previousFocused: HTMLElement | null = null;
	let skipRestore = false;
	let active = false;
	const typeahead = { buffer: '', time: 0 };

	function activate() {
		const menu = menuRef.value;
		if (!menu || active) return;
		active = true;
		previousFocused = document.activeElement as HTMLElement | null;
		const items = getItems(menu);
		if (items.length > 0) {
			applyRoving(items, 0);
			if (focusFirstOnOpen) items[0].focus();
		}
	}

	function deactivate() {
		if (!active) return;
		active = false;
		if (skipRestore) {
			skipRestore = false;
			return;
		}
		const menu = menuRef.value;
		const curr = document.activeElement;
		const focusLeftWithMenu = curr === document.body || (menu !== null && menu.contains(curr));
		if (previousFocused && focusLeftWithMenu && typeof previousFocused.focus === 'function') {
			previousFocused.focus();
		}
		previousFocused = null;
	}

	onMounted(() => {
		if (toValue(options.open)) activate();
	});

	watch(
		() => toValue(options.open),
		(isOpen) => {
			if (isOpen) activate();
			else deactivate();
		},
		{ flush: 'post' },
	);

	onUnmounted(() => {
		deactivate();
	});

	function focusItem(items: HTMLElement[], index: number) {
		const clamped = (index + items.length) % items.length;
		applyRoving(items, clamped);
		items[clamped].focus();
	}

	function onKeyDown(e: KeyboardEvent) {
		const menu = menuRef.value;
		if (!menu) return;
		const items = getItems(menu);
		if (items.length === 0) return;
		const currentIndex = items.indexOf(document.activeElement as HTMLElement);

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				focusItem(items, currentIndex < 0 ? 0 : currentIndex + 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusItem(items, currentIndex < 0 ? items.length - 1 : currentIndex - 1);
				break;
			case 'Home':
				e.preventDefault();
				focusItem(items, 0);
				break;
			case 'End':
				e.preventDefault();
				focusItem(items, items.length - 1);
				break;
			case 'Tab':
				// Tab closes the menu and lets focus continue to the next element.
				skipRestore = true;
				onClose?.();
				break;
			default: {
				// Typeahead: focus the next item whose label starts with the typed run.
				// Space is reserved for item activation, so it never starts a search.
				if (e.key.length !== 1 || e.key === ' ' || e.metaKey || e.ctrlKey || e.altKey) break;
				const now = Date.now();
				const buffer =
					now - typeahead.time > TYPEAHEAD_RESET_MS ? e.key : typeahead.buffer + e.key;
				typeahead.buffer = buffer;
				typeahead.time = now;
				const needle = buffer.toLowerCase();
				const start = currentIndex < 0 ? 0 : currentIndex + 1;
				const ordered = [...items.slice(start), ...items.slice(0, start)];
				const match = ordered.find((item) =>
					(item.textContent ?? '').trim().toLowerCase().startsWith(needle),
				);
				if (match) {
					e.preventDefault();
					focusItem(items, items.indexOf(match));
				}
			}
		}
	}

	return { onKeyDown };
}
