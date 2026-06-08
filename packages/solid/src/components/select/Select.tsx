'use client';

import {
	children as resolveChildren,
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	Show,
	splitProps,
	untrack,
	useContext,
	type JSX,
} from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	SelectContentProps,
	SelectContextValue,
	SelectGroupLabelProps,
	SelectGroupProps,
	SelectItemProps,
	SelectRootProps,
	SelectSeparatorProps,
	SelectTriggerProps,
	SelectValueProps,
} from './Select.types';

interface RegisteredItem {
	value: string;
	label: string;
	disabled: boolean;
}

const TYPEAHEAD_RESET_MS = 800;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
	const ctx = useContext(SelectContext);
	if (!ctx) throw new Error('Select sub-components must be used within Select.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: SelectRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'disabled',
		'class',
		'children',
		'ref',
	]);

	const [selectedValue, setSelectedValue] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		get onChange() {
			return local.onChange;
		},
	});

	const [open, setOpen] = createSignal(false);
	const [labelMap, setLabelMap] = createSignal<Record<string, string>>({});
	const [persistedLabel, setPersistedLabel] = createSignal('');
	// Ordered registry of currently mounted options — drives arrow navigation,
	// typeahead, and aria-activedescendant.
	const [items, setItems] = createSignal<RegisteredItem[]>([]);
	const [activeValue, setActiveValue] = createSignal<string | null>(null);
	let typeaheadState = { buffer: '', time: 0 };

	let rootEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (rootEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);
	createClickOutside(
		() => rootEl,
		() => setOpen(false),
	);

	const baseId = createId('select');
	const listboxId = `${baseId}-listbox`;
	const getOptionId = (value: string) => `${baseId}-opt-${value}`;

	const select = (value: string, label: string) => {
		setSelectedValue(value);
		setPersistedLabel(label);
		setOpen(false);
	};

	const registerItem = (value: string, label: string, itemDisabled: boolean) => {
		// Persistent label map so Select.Value can render the chosen label even
		// while Content (and the ordered registry) is unmounted.
		setLabelMap((prev) => (prev[value] === label ? prev : { ...prev, [value]: label }));
		setItems((prev) => {
			const idx = prev.findIndex((i) => i.value === value);
			if (idx === -1) return [...prev, { value, label, disabled: itemDisabled }];
			const existing = prev[idx];
			if (existing.label === label && existing.disabled === itemDisabled) return prev;
			const copy = prev.slice();
			copy[idx] = { value, label, disabled: itemDisabled };
			return copy;
		});
	};

	// Items persist in the registry after Content unmounts (like the label map)
	// so closed-state typeahead and instant re-open keep working. A genuinely
	// removed option is re-registered with fresh data on next mount.
	const unregisterItem = (_value: string) => {};

	const moveActive = (delta: number) => {
		const enabled = items().filter((i) => !i.disabled);
		if (enabled.length === 0) return;
		const curr = activeValue();
		const idx = enabled.findIndex((i) => i.value === curr);
		let next = idx < 0 ? (delta > 0 ? 0 : enabled.length - 1) : idx + delta;
		if (next < 0) next = enabled.length - 1;
		if (next >= enabled.length) next = 0;
		setActiveValue(enabled[next].value);
	};

	const setActiveEdge = (edge: 'first' | 'last') => {
		const enabled = items().filter((i) => !i.disabled);
		if (enabled.length === 0) return;
		setActiveValue(edge === 'first' ? enabled[0].value : enabled[enabled.length - 1].value);
	};

	const selectActive = () => {
		const item = items().find((i) => i.value === activeValue() && !i.disabled);
		if (item) select(item.value, item.label);
	};

	// Select-only typeahead: typing letters jumps to (and, when closed, selects)
	// the next option whose label starts with the buffered string.
	const typeahead = (char: string) => {
		const now = Date.now();
		const prev = typeaheadState;
		const buffer = now - prev.time > TYPEAHEAD_RESET_MS ? char : prev.buffer + char;
		typeaheadState = { buffer, time: now };

		const enabled = items().filter((i) => !i.disabled);
		if (enabled.length === 0) return;
		const needle = buffer.toLowerCase();
		const anchor = enabled.findIndex((i) => i.value === (activeValue() ?? selectedValue()));
		// Search from just after the anchor, wrapping around.
		const ordered = [...enabled.slice(anchor + 1), ...enabled.slice(0, anchor + 1)];
		const match =
			ordered.find((i) => i.label.toLowerCase().startsWith(needle)) ??
			// Single repeated char cycles through same-initial options.
			(buffer.length === 1 ? undefined : ordered.find((i) => i.label.toLowerCase().startsWith(char.toLowerCase())));
		if (!match) return;
		if (open()) setActiveValue(match.value);
		else select(match.value, match.label);
	};

	// On open, seat the active option on the current selection (or first enabled);
	// on close, clear it. Tracks `items` and `selectedValue` so the cursor seats
	// correctly even when options register after the listbox opens.
	createEffect(() => {
		if (!open()) {
			setActiveValue(null);
			return;
		}
		const enabled = items().filter((i) => !i.disabled);
		const sel = selectedValue();
		if (enabled.length === 0) return;
		const curr = untrack(activeValue);
		if (curr && enabled.some((i) => i.value === curr)) return;
		const match = enabled.find((i) => i.value === sel);
		setActiveValue(match ? match.value : enabled[0].value);
	});

	// Prefer the persisted label (set on explicit selection), fall back to the
	// label map (covers defaultValue / controlled value on first render).
	const selectedLabel = () => persistedLabel() || labelMap()[selectedValue() ?? ''] || '';

	const ctxValue: SelectContextValue = {
		get open() {
			return open();
		},
		get selectedValue() {
			return selectedValue() ?? '';
		},
		get selectedLabel() {
			return selectedLabel();
		},
		get disabled() {
			return !!local.disabled;
		},
		get activeValue() {
			return activeValue();
		},
		get listboxId() {
			return listboxId;
		},
		getOptionId,
		setOpen,
		select,
		setActiveValue,
		moveActive,
		setActiveEdge,
		selectActive,
		typeahead,
		registerItem,
		unregisterItem,
	};

	return (
		<SelectContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
				class={local.class}
				data-open={open() ? '' : undefined}
				data-disabled={local.disabled ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</SelectContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: SelectTriggerProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick']);
	const ctx = useSelectContext();

	const state = createInteractiveState({
		get disabled() {
			return ctx.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		if (!ctx.disabled) ctx.setOpen(!ctx.open);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
		if (!ctx.disabled) {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					if (!ctx.open) ctx.setOpen(true);
					else ctx.moveActive(1);
					break;
				case 'ArrowUp':
					e.preventDefault();
					if (!ctx.open) ctx.setOpen(true);
					else ctx.moveActive(-1);
					break;
				case 'Home':
					if (ctx.open) {
						e.preventDefault();
						ctx.setActiveEdge('first');
					}
					break;
				case 'End':
					if (ctx.open) {
						e.preventDefault();
						ctx.setActiveEdge('last');
					}
					break;
				case 'Enter':
				case ' ':
					e.preventDefault();
					if (!ctx.open) ctx.setOpen(true);
					else ctx.selectActive();
					break;
				case 'Escape':
					if (ctx.open) {
						e.preventDefault();
						ctx.setOpen(false);
					}
					break;
				default:
					// Printable single characters drive select-only typeahead.
					if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
						ctx.typeahead(e.key);
					}
			}
		}
		(state.handlers.onKeyDown as (event: KeyboardEvent) => void)(e);
	};

	return (
		<button
			type='button'
			aria-haspopup='listbox'
			aria-expanded={ctx.open}
			aria-controls={ctx.open ? ctx.listboxId : undefined}
			aria-activedescendant={ctx.open && ctx.activeValue ? ctx.getOptionId(ctx.activeValue) : undefined}
			disabled={ctx.disabled}
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			data-disabled={ctx.disabled ? '' : undefined}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}
			onKeyDown={handleKeyDown}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

function Value(props: SelectValueProps) {
	const [local, rest] = splitProps(props, ['placeholder', 'class']);
	const ctx = useSelectContext();
	const placeholder = () => local.placeholder ?? 'Select an option';

	return (
		<span
			class={local.class}
			data-placeholder={!ctx.selectedLabel ? '' : undefined}
			{...rest}>
			{ctx.selectedLabel || placeholder()}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: SelectContentProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useSelectContext();

	return (
		<Show when={ctx.open}>
			<div
				id={ctx.listboxId}
				role='listbox'
				class={local.class}
				data-state='open'
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function Item(props: SelectItemProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'textValue',
		'disabled',
		'class',
		'children',
		'onClick',
		'onMouseEnter',
	]);
	const ctx = useSelectContext();

	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const isSelected = () => ctx.selectedValue === local.value;
	const isActive = () => ctx.activeValue === local.value;

	// Resolve children so we can derive a string label when textValue isn't set.
	const resolved = resolveChildren(() => local.children);
	const label = () => {
		if (local.textValue !== undefined) return local.textValue;
		const c = resolved();
		return typeof c === 'string' ? c : local.value;
	};

	createEffect(() => {
		ctx.registerItem(local.value, label(), !!local.disabled);
	});
	onCleanup(() => ctx.unregisterItem(local.value));

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!local.disabled) ctx.select(local.value, label());
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handleMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!local.disabled) ctx.setActiveValue(local.value);
		(state.handlers.onMouseEnter as ((event: MouseEvent) => void) | undefined)?.(e);
		const userOnMouseEnter = local.onMouseEnter;
		if (typeof userOnMouseEnter === 'function') {
			(userOnMouseEnter as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			role='option'
			id={ctx.getOptionId(local.value)}
			aria-selected={isSelected()}
			aria-disabled={local.disabled || undefined}
			class={local.class}
			data-selected={isSelected() ? '' : undefined}
			data-disabled={local.disabled ? '' : undefined}
			{...state.dataAttributes}
			{...merged}
			// `data-highlighted` marks the aria-activedescendant option. Set after the
			// spreads so it never collides with createInteractiveState's `data-active`
			// (pressed state).
			data-highlighted={isActive() ? '' : undefined}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

function Separator(props: SelectSeparatorProps) {
	const [local, rest] = splitProps(props, ['class']);
	return (
		<hr
			class={local.class}
			aria-hidden='true'
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Group + GroupLabel
// ---------------------------------------------------------------------------

function Group(props: SelectGroupProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	return (
		<div
			role='group'
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

function GroupLabel(props: SelectGroupLabelProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	return (
		<span
			class={local.class}
			{...rest}>
			{local.children}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Select = { Root, Trigger, Value, Content, Item, Separator, Group, GroupLabel };

export { Root, Trigger, Value, Content, Item, Separator, Group, GroupLabel };