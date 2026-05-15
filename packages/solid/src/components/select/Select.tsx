import {
	children as resolveChildren,
	createContext,
	createEffect,
	createSignal,
	Show,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
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
		onChange: local.onChange,
	});

	const [open, setOpen] = createSignal(false);
	const [labelMap, setLabelMap] = createSignal<Record<string, string>>({});
	const [persistedLabel, setPersistedLabel] = createSignal('');

	let rootEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (rootEl = el),
		local.ref as ((el: HTMLDivElement) => void) | undefined,
	);
	createClickOutside(
		() => rootEl,
		() => setOpen(false),
	);

	const select = (value: string, label: string) => {
		setSelectedValue(value);
		setPersistedLabel(label);
		setOpen(false);
	};

	const registerItem = (value: string, label: string) => {
		setLabelMap((prev) => ({ ...prev, [value]: label }));
	};

	// Items must not unregister on unmount — the label map must persist
	// so Select.Value can display the selected label even when Content is closed.
	const unregisterItem = (_value: string) => {};

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
		setOpen,
		select,
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
		if (e.key === 'Escape') ctx.setOpen(false);
		if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			ctx.setOpen(true);
		}
		(state.handlers.onKeyDown as (event: KeyboardEvent) => void)(e);
	};

	return (
		<button
			type='button'
			aria-haspopup='listbox'
			aria-expanded={ctx.open}
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
	const [local, rest] = splitProps(props, ['value', 'textValue', 'disabled', 'class', 'children', 'onClick']);
	const ctx = useSelectContext();

	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const isSelected = () => ctx.selectedValue === local.value;

	// Resolve children so we can derive a string label when textValue isn't set.
	const resolved = resolveChildren(() => local.children);
	const label = () => {
		if (local.textValue !== undefined) return local.textValue;
		const c = resolved();
		return typeof c === 'string' ? c : local.value;
	};

	createEffect(() => {
		ctx.registerItem(local.value, label());
	});

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!local.disabled) ctx.select(local.value, label());
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (!local.disabled) ctx.select(local.value, label());
		}
		(state.handlers.onKeyDown as (event: KeyboardEvent) => void)(e);
	};

	return (
		<div
			role='option'
			aria-selected={isSelected()}
			class={local.class}
			data-selected={isSelected() ? '' : undefined}
			data-disabled={local.disabled ? '' : undefined}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}
			onKeyDown={handleKeyDown}>
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
