import { createEffect, createMemo, mergeProps, onCleanup, type Accessor } from 'solid-js';

export type HotkeyHandler = (event: KeyboardEvent) => void;

export interface CreateHotkeysOptions {
	/** Element to attach the listener to. Defaults to `window`. */
	target?: Accessor<HTMLElement | null | undefined> | HTMLElement | Window | Document | null;
	/** Event to listen on. Defaults to `keydown`. */
	event?: 'keydown' | 'keyup';
	/** Disable all hotkeys. */
	enabled?: boolean;
	/**
	 * Active scope name. A hotkey defined with `scope: 'modal'` only fires when
	 * its scope is included in `activeScopes`. Use `'*'` (default) to always fire.
	 */
	scope?: string;
	/** Active scopes for matching. Defaults to `['*']`. */
	activeScopes?: string[];
	/** Fire even when focus is inside an editable element (input/textarea/[contenteditable]). Defaults to `false`. */
	enableInInputs?: boolean;
	/** Call `preventDefault()` on every match. Defaults to `true`. */
	preventDefault?: boolean;
}

export type HotkeyMap = Record<string, HotkeyHandler>;

const MOD_KEYS = new Set(['mod', 'meta', 'cmd', 'command', 'ctrl', 'control', 'shift', 'alt', 'option']);
const KEY_ALIASES: Record<string, string> = {
	esc: 'escape',
	return: 'enter',
	space: ' ',
	plus: '+',
	left: 'arrowleft',
	right: 'arrowright',
	up: 'arrowup',
	down: 'arrowdown',
};

interface ParsedCombo {
	key: string;
	mod: boolean;
	meta: boolean;
	ctrl: boolean;
	shift: boolean;
	alt: boolean;
}

function parseCombo(combo: string): ParsedCombo {
	const parts = combo
		.toLowerCase()
		.split('+')
		.map((p) => p.trim())
		.filter(Boolean);

	const parsed: ParsedCombo = {
		key: '',
		mod: false,
		meta: false,
		ctrl: false,
		shift: false,
		alt: false,
	};

	for (const part of parts) {
		if (MOD_KEYS.has(part)) {
			if (part === 'mod') parsed.mod = true;
			else if (part === 'meta' || part === 'cmd' || part === 'command') parsed.meta = true;
			else if (part === 'ctrl' || part === 'control') parsed.ctrl = true;
			else if (part === 'shift') parsed.shift = true;
			else if (part === 'alt' || part === 'option') parsed.alt = true;
		} else {
			parsed.key = KEY_ALIASES[part] ?? part;
		}
	}

	return parsed;
}

function isEditable(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	return target.isContentEditable;
}

function matchesCombo(event: KeyboardEvent, combo: ParsedCombo): boolean {
	const eventKey = event.key.toLowerCase();
	if (eventKey !== combo.key) return false;

	const isMac =
		typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
	const modPressed = isMac ? event.metaKey : event.ctrlKey;

	if (combo.mod && !modPressed) return false;
	if (combo.meta && !event.metaKey) return false;
	if (combo.ctrl && !event.ctrlKey) return false;
	if (combo.shift !== event.shiftKey) return false;
	if (combo.alt !== event.altKey) return false;

	if (!combo.mod && !combo.meta && !combo.ctrl) {
		if (isMac ? event.metaKey : event.ctrlKey) return false;
	}

	return true;
}

function resolveTarget(target: CreateHotkeysOptions['target']): EventTarget | null {
	if (!target) return typeof window !== 'undefined' ? window : null;
	if (typeof target === 'function') return target() ?? null;
	return target;
}

/**
 * Subscribes to keyboard combos with cross-platform `mod` (Cmd on macOS, Ctrl elsewhere).
 *
 * Combos are strings like `'mod+k'`, `'shift+/'`, `'mod+shift+p'`. Keys are joined
 * with `+`; aliases include `esc`, `return`, `space`, `left/right/up/down`.
 *
 * **Scopes** let you scope hotkeys to a region (e.g., a modal). A hotkey registered
 * with `scope: 'modal'` only fires when `'modal'` is in `activeScopes`. The default
 * scope `'*'` always fires.
 *
 * **Inputs**: hotkeys are suppressed when focus is inside an input/textarea/contenteditable.
 * Pass `enableInInputs: true` to override.
 *
 * Pass `options` with getters to make `enabled`, `scope`, or `activeScopes` reactive.
 *
 * @example
 * createHotkeys({
 *   'mod+k': () => openCommandPalette(),
 *   'mod+shift+p': () => print(),
 *   'escape': () => close(),
 * })
 */
export function createHotkeys(map: HotkeyMap, options: CreateHotkeysOptions = {}): void {
	const merged = mergeProps(
		{
			event: 'keydown' as const,
			enabled: true,
			scope: '*',
			activeScopes: ['*'],
			enableInInputs: false,
			preventDefault: true,
		},
		options,
	);

	const parsed = createMemo(() =>
		Object.keys(map).map((combo) => [parseCombo(combo), combo] as [ParsedCombo, string]),
	);

	createEffect(() => {
		if (!merged.enabled) return;
		const scopeMatches = merged.scope === '*' || merged.activeScopes.includes(merged.scope);
		if (!scopeMatches) return;

		const node = resolveTarget(merged.target);
		if (!node) return;

		const handle = (e: Event) => {
			const ev = e as KeyboardEvent;
			if (!merged.enableInInputs && isEditable(ev.target)) return;

			for (const [combo, originalKey] of parsed()) {
				if (matchesCombo(ev, combo)) {
					const handler = map[originalKey];
					if (!handler) continue;
					if (merged.preventDefault) ev.preventDefault();
					handler(ev);
					return;
				}
			}
		};

		node.addEventListener(merged.event, handle);
		onCleanup(() => node.removeEventListener(merged.event, handle));
	});
}
