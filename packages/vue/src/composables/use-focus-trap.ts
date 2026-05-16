import { watch, onUnmounted, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

export interface UseFocusTrapOptions {
	/** Whether the trap is active */
	active?: MaybeRefOrGetter<boolean>;
	/** Restore focus to the previously focused element when the trap deactivates */
	returnFocus?: boolean;
	/** Element to focus initially. Defaults to the first focusable child. */
	initialFocus?: Ref<HTMLElement | null> | HTMLElement | null;
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

function resolveInitialFocus(initialFocus: UseFocusTrapOptions['initialFocus']): HTMLElement | null {
	if (!initialFocus) return null;
	if (initialFocus instanceof HTMLElement) return initialFocus;
	return (initialFocus as Ref<HTMLElement | null>).value ?? null;
}

/**
 * Traps keyboard focus inside the given container while active.
 *
 * Cycles Tab / Shift+Tab between the first and last focusable descendants. On activation,
 * focus moves to `initialFocus` (or the first focusable child). On deactivation, focus
 * returns to whatever was focused before, unless `returnFocus` is false.
 *
 * @example
 * const dialogRef = ref<HTMLDivElement | null>(null)
 * useFocusTrap(dialogRef, { active: open })
 */
export function useFocusTrap(containerRef: Ref<HTMLElement | null>, options: UseFocusTrapOptions = {}) {
	const { returnFocus = true, initialFocus } = options;
	let previouslyFocused: HTMLElement | null = null;
	let attached = false;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;
		const container = containerRef.value;
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

	function activate() {
		const container = containerRef.value;
		if (!container) return;

		previouslyFocused = document.activeElement as HTMLElement | null;
		const target = resolveInitialFocus(initialFocus) ?? getFocusable(container)[0] ?? container;
		target?.focus();

		document.addEventListener('keydown', handleKeyDown);
		attached = true;
	}

	function deactivate() {
		if (!attached) return;
		document.removeEventListener('keydown', handleKeyDown);
		attached = false;
		if (returnFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
			previouslyFocused.focus();
		}
		previouslyFocused = null;
	}

	watch(
		() => toValue(options.active) ?? true,
		(isActive) => {
			if (isActive) activate();
			else deactivate();
		},
		{ immediate: true, flush: 'post' },
	);

	onUnmounted(deactivate);
}
