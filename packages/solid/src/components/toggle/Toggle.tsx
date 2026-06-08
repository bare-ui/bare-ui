'use client';

import {
	createContext,
	createSignal,
	onCleanup,
	onMount,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { mergeProps as mergeHandlers } from '@/utils/merge-props';
import type { ToggleGroupContextValue, ToggleGroupRootProps, ToggleProps } from './Toggle.types';

// ---------------------------------------------------------------------------
// ToggleGroup context (optional — Toggle works standalone too)
// ---------------------------------------------------------------------------

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

function Toggle(props: ToggleProps) {
	const [local, rest] = splitProps(props, [
		'pressed',
		'defaultPressed',
		'onPressedChange',
		'value',
		'disabled',
		'class',
		'children',
		'ref',
	]);

	const group = useContext(ToggleGroupContext);
	const inGroup = () => group !== null && local.value !== undefined;

	// Standalone controllable pressed state.
	const [standalonePressed, setStandalonePressed] = createSignal(local.defaultPressed ?? false);
	const standaloneValue = () => (local.pressed !== undefined ? local.pressed : standalonePressed());
	const setStandalone = (next: boolean) => {
		if (local.pressed === undefined) setStandalonePressed(next);
		local.onPressedChange?.(next);
	};

	const id = createId('toggle');
	let innerRef: HTMLButtonElement | undefined;
	const mergedRef = createMergedRefs<HTMLButtonElement>(
		(el) => (innerRef = el),
		(el) => (local.ref as ((el: HTMLButtonElement) => void) | undefined)?.(el),
	);

	// Register with the group for roving focus (no-op when standalone).
	onMount(() => {
		if (!inGroup() || !group) return;
		if (!innerRef) return;
		const cleanup = group.register(id, innerRef);
		onCleanup(() => cleanup());
	});

	const pressed = () =>
		inGroup() && group ? group.isPressed(local.value as string) : standaloneValue();
	const disabled = () =>
		inGroup() && group ? group.disabled || !!local.disabled : !!local.disabled;

	const state = createInteractiveState({
		get disabled() {
			return disabled();
		},
	});

	const ownHandlers = {
		onClick: () => {
			if (disabled()) return;
			if (inGroup() && group) group.toggle(local.value as string);
			else setStandalone(!standaloneValue());
		},
		onFocus: () => {
			if (inGroup() && group) group.onItemFocus(id);
		},
		onKeyDown: (e: KeyboardEvent) => {
			if (inGroup() && group && !e.defaultPrevented) group.onItemKeyDown(e);
		},
	};

	// Compose consumer handlers (in `rest`) with interactive-state handlers, then
	// with our own handlers. Consumer fires first, then ours.
	const merged = mergeHandlers(mergeHandlers(rest, state.handlers), ownHandlers);

	const tabIndex = () =>
		inGroup() && group && group.rovingFocus ? (group.isTabbable(id) ? 0 : -1) : undefined;

	return (
		<button
			ref={mergedRef}
			type='button'
			aria-pressed={pressed()}
			disabled={disabled()}
			tabindex={tabIndex()}
			class={local.class}
			data-state={pressed() ? 'on' : 'off'}
			data-disabled={disabled() ? '' : undefined}
			{...state.dataAttributes}
			{...merged}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// ToggleGroup.Root
// ---------------------------------------------------------------------------

function Root(props: ToggleGroupRootProps) {
	const [local, rest] = splitProps(props as ToggleGroupRootProps, [
		'type',
		'disabled',
		'orientation',
		'loop',
		'rovingFocus',
		'value',
		'defaultValue',
		'onChange',
		'class',
		'children',
	]);

	const isSingle = () => local.type === 'single';
	const orientation = () => local.orientation ?? 'horizontal';
	const loop = () => local.loop ?? true;
	const rovingFocus = () => local.rovingFocus ?? true;
	const groupDisabled = () => local.disabled ?? false;

	// Normalize the controlled value to a string[] internally for both modes.
	const controlled = (): string[] | undefined => {
		const raw = local.value;
		if (raw === undefined) return undefined;
		if (isSingle()) return raw ? [raw as string] : [];
		return raw as string[];
	};

	const initial = (): string[] => {
		if (isSingle()) {
			const dv = local.defaultValue as string | null | undefined;
			return dv ? [dv] : [];
		}
		return ((local.defaultValue as string[] | undefined) ?? []).slice();
	};

	const [uncontrolled, setUncontrolled] = createSignal<string[]>(initial());

	const isControlled = () => controlled() !== undefined;
	const current = (): string[] => (isControlled() ? (controlled() as string[]) : uncontrolled());

	const emit = (next: string[]) => {
		if (!isControlled()) setUncontrolled(next);
		if (isSingle()) (local.onChange as ((v: string | null) => void) | undefined)?.(next[0] ?? null);
		else (local.onChange as ((v: string[]) => void) | undefined)?.(next);
	};

	const isPressed = (v: string) => current().includes(v);

	const toggle = (v: string) => {
		const cur = current();
		if (isSingle()) {
			emit(cur.includes(v) ? [] : [v]);
		} else {
			emit(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
		}
	};

	// --- Roving focus (same model as Toolbar) ---
	const items: Array<{ id: string; el: HTMLElement }> = [];
	const [activeId, setActiveId] = createSignal<string | null>(null);

	const register = (itemId: string, el: HTMLElement) => {
		items.push({ id: itemId, el });
		if (activeId() === null) setActiveId(itemId);
		// Cleanup runs imperatively on item unregister — reading the current
		// activeId() there is intentional, not a missed tracked scope.
		// eslint-disable-next-line solid/reactivity
		return () => {
			const idx = items.findIndex((it) => it.id === itemId);
			if (idx !== -1) items.splice(idx, 1);
			if (activeId() === itemId) setActiveId(items[0]?.id ?? null);
		};
	};

	const isTabbable = (itemId: string) => activeId() === itemId;
	const onItemFocus = (itemId: string) => setActiveId(itemId);

	const onItemKeyDown = (e: KeyboardEvent) => {
		if (!rovingFocus()) return;
		const axis = orientation();
		const nextKey = axis === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
		const prevKey = axis === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
		if (!['Home', 'End', nextKey, prevKey].includes(e.key)) return;

		const ordered = [...items]
			.filter((it) => !(it.el as HTMLButtonElement).disabled)
			.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
		if (ordered.length === 0) return;
		const currentIndex = ordered.findIndex((it) => it.el === document.activeElement);

		let nextIndex = currentIndex;
		if (e.key === nextKey) {
			nextIndex = currentIndex + 1;
			if (nextIndex >= ordered.length) nextIndex = loop() ? 0 : ordered.length - 1;
		} else if (e.key === prevKey) {
			nextIndex = currentIndex - 1;
			if (nextIndex < 0) nextIndex = loop() ? ordered.length - 1 : 0;
		} else if (e.key === 'Home') {
			nextIndex = 0;
		} else if (e.key === 'End') {
			nextIndex = ordered.length - 1;
		}

		const target = ordered[nextIndex];
		if (target) {
			e.preventDefault();
			target.el.focus();
			onItemFocus(target.id);
		}
	};

	const ctx: ToggleGroupContextValue = {
		isPressed,
		toggle,
		get disabled() {
			return groupDisabled();
		},
		get orientation() {
			return orientation();
		},
		get rovingFocus() {
			return rovingFocus();
		},
		isTabbable,
		register,
		onItemFocus,
		onItemKeyDown,
	};

	return (
		<ToggleGroupContext.Provider value={ctx}>
			<div
				role='toolbar'
				aria-orientation={orientation()}
				class={local.class}
				data-orientation={orientation()}
				data-disabled={groupDisabled() ? '' : undefined}
				{...(rest as JSX.HTMLAttributes<HTMLDivElement>)}>
				{local.children}
			</div>
		</ToggleGroupContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export { Toggle };

export const ToggleGroup = {
	Root,
};