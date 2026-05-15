import { createEffect, mergeProps, onCleanup, type Accessor } from 'solid-js';

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

export interface CreateKeyboardOptions {
	/** Element to attach the listener to. Defaults to `window`. */
	target?: Accessor<HTMLElement | null | undefined> | HTMLElement | Window | Document | null;
	/** Event to listen on. Defaults to `keydown`. */
	event?: 'keydown' | 'keyup' | 'keypress';
	/** Disable the listener */
	enabled?: boolean;
}

function resolveTarget(target: CreateKeyboardOptions['target']): EventTarget | null {
	if (!target) return typeof window !== 'undefined' ? window : null;
	if (typeof target === 'function') return target() ?? null;
	return target;
}

/**
 * Subscribes to keyboard events with a map of key → handler.
 *
 * Keys are matched against `event.key` (case-insensitive). Pass a tuple to require
 * modifier keys: `{ s: [save, { meta: true }] }` matches Cmd/Ctrl+S only.
 *
 * Pass `options` with getters to make `target` or `enabled` reactive:
 * `{ get enabled() { return isActive() } }`
 *
 * @example
 * createKeyboard({
 *   Escape: () => close(),
 *   s: [() => save(), { meta: true, preventDefault: true }],
 * })
 */
export function createKeyboard(map: KeyboardMap, options: CreateKeyboardOptions = {}) {
	const merged = mergeProps({ event: 'keydown', enabled: true }, options);

	createEffect(() => {
		if (!merged.enabled) return;
		const node = resolveTarget(merged.target);
		if (!node) return;

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

		node.addEventListener(merged.event, handle);
		onCleanup(() => node.removeEventListener(merged.event, handle));
	});
}
