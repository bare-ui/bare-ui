import { onMounted, onUnmounted, watch, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

export interface KeyboardHandlerOptions {
	/** Match Ctrl key state */
	ctrl?: boolean;
	/** Match Meta (Cmd) key state */
	meta?: boolean;
	/** Match Shift key state */
	shift?: boolean;
	/** Match Alt key state */
	alt?: boolean;
	/** Call `preventDefault()` when the handler matches */
	preventDefault?: boolean;
	/** Call `stopPropagation()` when the handler matches */
	stopPropagation?: boolean;
}

export type KeyHandler = (event: KeyboardEvent) => void;

export type KeyboardMap = Record<string, KeyHandler | [KeyHandler, KeyboardHandlerOptions]>;

export interface UseKeyboardOptions {
	/** Element to attach the listener to. Defaults to `window`. */
	target?: Ref<HTMLElement | null> | HTMLElement | Window | Document | null;
	/** Event to listen on. Defaults to `keydown`. */
	event?: 'keydown' | 'keyup' | 'keypress';
	/** Disable the listener */
	enabled?: MaybeRefOrGetter<boolean>;
}

function resolveTarget(target: UseKeyboardOptions['target']): EventTarget | null {
	if (!target) return typeof window !== 'undefined' ? window : null;
	if (target instanceof Window || target instanceof Document || target instanceof HTMLElement) return target;
	return (target as Ref<HTMLElement | null>).value ?? null;
}

/**
 * Subscribes to keyboard events with a map of key → handler.
 *
 * Keys are matched against `event.key` (case-insensitive). Pass a tuple to require
 * modifier keys: `{ s: [save, { meta: true }] }` matches Cmd/Ctrl+S only.
 *
 * @example
 * useKeyboard({
 *   Escape: () => close(),
 *   s: [() => save(), { meta: true, preventDefault: true }],
 * })
 */
export function useKeyboard(map: KeyboardMap, options: UseKeyboardOptions = {}) {
	const { target, event = 'keydown' } = options;
	let attachedTo: EventTarget | null = null;

	function handle(e: Event) {
		const ev = e as KeyboardEvent;
		const entry = Object.entries(map).find(([key]) => key.toLowerCase() === ev.key.toLowerCase());
		if (!entry) return;

		const [, value] = entry;
		const [handler, opts] = Array.isArray(value) ? value : [value, {} as KeyboardHandlerOptions];

		if (opts.ctrl !== undefined && opts.ctrl !== ev.ctrlKey) return;
		if (opts.meta !== undefined && opts.meta !== ev.metaKey) return;
		if (opts.shift !== undefined && opts.shift !== ev.shiftKey) return;
		if (opts.alt !== undefined && opts.alt !== ev.altKey) return;

		if (opts.preventDefault) ev.preventDefault();
		if (opts.stopPropagation) ev.stopPropagation();
		handler(ev);
	}

	function attach() {
		const node = resolveTarget(target);
		if (!node) return;
		node.addEventListener(event, handle);
		attachedTo = node;
	}

	function detach() {
		if (!attachedTo) return;
		attachedTo.removeEventListener(event, handle);
		attachedTo = null;
	}

	onMounted(() => {
		if (toValue(options.enabled) ?? true) attach();
	});

	onUnmounted(detach);

	watch(
		() => toValue(options.enabled) ?? true,
		(enabled) => {
			if (enabled && !attachedTo) attach();
			else if (!enabled && attachedTo) detach();
		},
	);
}
