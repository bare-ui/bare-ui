import { onMounted, onUnmounted, watch, type MaybeRefOrGetter, type Ref, toValue } from 'vue';

export type HotkeyHandler = (event: KeyboardEvent) => void;

export interface UseHotkeysOptions {
	/** Element to attach the listener to. Defaults to `window`. */
	target?: Ref<HTMLElement | null> | HTMLElement | Window | Document | null;
	/** Event to listen on. Defaults to `keydown`. */
	event?: 'keydown' | 'keyup';
	/** Disable all hotkeys. */
	enabled?: MaybeRefOrGetter<boolean>;
	/**
	 * Scope this hotkey belongs to. A hotkey with `scope: 'modal'` only fires when
	 * `'modal'` appears in `activeScopes`. Use `'*'` (default) to always fire.
	 */
	scope?: string;
	/** Active scopes for matching. Defaults to `['*']`. */
	activeScopes?: MaybeRefOrGetter<string[]>;
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

function matches(event: KeyboardEvent, combo: ParsedCombo): boolean {
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

	// If no explicit modifier was requested, disallow extra modifiers (so `k` doesn't fire on `mod+k`).
	if (!combo.mod && !combo.meta && !combo.ctrl) {
		if (isMac ? event.metaKey : event.ctrlKey) return false;
	}

	return true;
}

function resolveTarget(target: UseHotkeysOptions['target']): EventTarget | null {
	if (!target) return typeof window !== 'undefined' ? window : null;
	if (target instanceof Window || target instanceof Document || target instanceof HTMLElement) return target;
	return (target as Ref<HTMLElement | null>).value ?? null;
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
 * @example
 * useHotkeys({
 *   'mod+k': () => openCommandPalette(),
 *   'mod+shift+p': () => print(),
 *   'escape': () => close(),
 * })
 */
export function useHotkeys(map: HotkeyMap, options: UseHotkeysOptions = {}): void {
	const {
		target,
		event = 'keydown',
		enabled,
		scope = '*',
		activeScopes,
		enableInInputs = false,
		preventDefault = true,
	} = options;

	const parsed: Array<[ParsedCombo, string]> = Object.keys(map).map((combo) => [parseCombo(combo), combo]);
	let attachedTo: EventTarget | null = null;

	function handle(e: Event) {
		const ev = e as KeyboardEvent;
		if (!enableInInputs && isEditable(ev.target)) return;

		for (const [combo, originalKey] of parsed) {
			if (matches(ev, combo)) {
				const handler = map[originalKey];
				if (!handler) continue;
				if (preventDefault) ev.preventDefault();
				handler(ev);
				return;
			}
		}
	}

	function isActive(): boolean {
		if (!(toValue(enabled) ?? true)) return false;
		if (scope === '*') return true;
		const scopes = toValue(activeScopes) ?? ['*'];
		return scopes.includes(scope);
	}

	function attach() {
		if (attachedTo) return;
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
		if (isActive()) attach();
	});

	onUnmounted(detach);

	watch(
		() => isActive(),
		(active) => {
			if (active) attach();
			else detach();
		},
	);
}
