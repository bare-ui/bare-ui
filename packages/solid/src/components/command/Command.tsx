import {
	createContext,
	createMemo,
	createSignal,
	onCleanup,
	Show,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createHotkeys } from '@/primitives/create-hotkeys';
import { createId } from '@/primitives/create-id';
import type {
	CommandContextValue,
	CommandEmptyProps,
	CommandFilter,
	CommandGroupContextValue,
	CommandGroupProps,
	CommandInputProps,
	CommandItemProps,
	CommandListProps,
	CommandRootProps,
	CommandSeparatorProps,
} from './Command.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CommandContext = createContext<CommandContextValue | null>(null);
const CommandGroupContext = createContext<CommandGroupContextValue | null>(null);

function useCommandContext() {
	const ctx = useContext(CommandContext);
	if (!ctx) throw new Error('Command sub-components must be used within Command.Root');
	return ctx;
}

const defaultFilter: CommandFilter = (value, search, keywords) => {
	if (!search) return true;
	const haystack = `${value} ${keywords.join(' ')}`.toLowerCase();
	return haystack.includes(search.trim().toLowerCase());
};

interface RegistryEntry {
	keywords: string[];
	disabled: boolean;
	groupId?: string;
	getOnSelect: () => ((value: string) => void) | undefined;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: CommandRootProps) {
	const [local, rest] = splitProps(props, [
		'searchValue',
		'defaultSearchValue',
		'onSearchChange',
		'filter',
		'onSelect',
		'loop',
		'open',
		'defaultOpen',
		'onOpenChange',
		'shortcut',
		'class',
		'children',
	]);

	const filter = () => local.filter ?? defaultFilter;
	const loop = () => local.loop ?? true;

	const [query, setQueryState] = createControllableState<string>({
		get value() {
			return local.searchValue;
		},
		defaultValue: local.defaultSearchValue ?? '',
		get onChange() {
			return local.onSearchChange;
		},
	});

	const managed = () => local.open !== undefined || local.defaultOpen !== undefined || !!local.shortcut;

	const [isOpen, setOpen] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		// `defaultValue` is an initial value only — read once at setup, intentionally.
		// eslint-disable-next-line solid/reactivity
		defaultValue: local.defaultOpen ?? !local.shortcut,
		get onChange() {
			return local.onOpenChange;
		},
	});

	// `shortcut` is treated as static config; the map is built once at setup.
	// eslint-disable-next-line solid/reactivity
	const hotkeyMap = local.shortcut ? { [local.shortcut]: () => setOpen(!isOpen()) } : {};
	createHotkeys(hotkeyMap, {
		get enabled() {
			return !!local.shortcut;
		},
		enableInInputs: true,
	});

	// A reactive registry: a signal holding the Map, bumped on every mutation so
	// derived computations (visible list, group visibility) re-run.
	const registry = new Map<string, RegistryEntry>();
	const [version, setVersion] = createSignal(0);
	const bump = () => setVersion((x) => x + 1);

	const [activeRaw, setActiveRaw] = createSignal<string | null>(null);

	const registerItem = (value: string, item: RegistryEntry) => {
		registry.set(value, item);
		bump();
		return () => {
			registry.delete(value);
			bump();
		};
	};

	const visible = createMemo<string[]>(() => {
		version(); // track registry mutations
		const search = query() ?? '';
		const match = filter();
		const result: string[] = [];
		for (const [value, entry] of registry) {
			if (match(value, search, entry.keywords)) result.push(value);
		}
		return result;
	});

	// Derive the effective active item so a filtered-out item never stays active.
	const activeValue = createMemo<string | null>(() => {
		const raw = activeRaw();
		const list = visible();
		return raw && list.includes(raw) ? raw : list[0] ?? null;
	});

	const setActiveValue = (value: string) => setActiveRaw(value);

	const moveActive = (delta: number) => {
		const list = visible();
		const len = list.length;
		if (len === 0) return;
		const active = activeValue();
		let i = active ? list.indexOf(active) : -1;
		// Step in `delta` direction, skipping disabled options, until an enabled
		// one is found or we run out of candidates.
		for (let step = 0; step < len; step++) {
			let nextIndex = i + delta;
			if (nextIndex < 0) nextIndex = loop() ? len - 1 : 0;
			else if (nextIndex >= len) nextIndex = loop() ? 0 : len - 1;
			if (nextIndex === i) break; // hit a non-looping boundary
			i = nextIndex;
			if (!registry.get(list[i])?.disabled) {
				setActiveRaw(list[i]);
				return;
			}
		}
	};

	const setActiveEdge = (edge: 'first' | 'last') => {
		const list = visible();
		const ordered = edge === 'first' ? list : [...list].reverse();
		const found = ordered.find((value) => !registry.get(value)?.disabled);
		if (found) setActiveRaw(found);
	};

	const close = () => {
		if (managed()) setOpen(false);
	};

	const selectItem = (value: string) => {
		const entry = registry.get(value);
		if (!entry || entry.disabled) return;
		entry.getOnSelect()?.(value);
		local.onSelect?.(value);
		if (managed()) setOpen(false);
	};

	const baseId = createId('command');
	const listboxId = `${baseId}-list`;
	const getItemId = (value: string) => `${baseId}-item-${encodeURIComponent(value)}`;

	const groupHasVisible = (groupId: string) =>
		visible().some((v) => registry.get(v)?.groupId === groupId);

	const ctx: CommandContextValue = {
		get query() {
			return query() ?? '';
		},
		setQuery: setQueryState,
		get searching() {
			return (query() ?? '').trim().length > 0;
		},
		get visible() {
			return visible();
		},
		get activeValue() {
			return activeValue();
		},
		setActiveValue,
		moveActive,
		setActiveEdge,
		registerItem,
		selectItem,
		isVisible: (value) => visible().includes(value),
		isActive: (value) => value === activeValue(),
		groupHasVisible,
		listboxId,
		getItemId,
		close,
	};

	return (
		<CommandContext.Provider value={ctx}>
			<Show when={!managed() || isOpen()}>
				<div
					data-command-root=''
					class={local.class}
					{...rest}>
					{local.children}
				</div>
			</Show>
		</CommandContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

function Input(props: CommandInputProps) {
	const [local, rest] = splitProps(props, ['class', 'onKeyDown']);
	const ctx = useCommandContext();
	const activeId = () => (ctx.activeValue ? ctx.getItemId(ctx.activeValue) : undefined);

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			ctx.moveActive(1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			ctx.moveActive(-1);
		} else if (e.key === 'Home') {
			e.preventDefault();
			ctx.setActiveEdge('first');
		} else if (e.key === 'End') {
			e.preventDefault();
			ctx.setActiveEdge('last');
		} else if (e.key === 'Enter' && ctx.activeValue) {
			e.preventDefault();
			ctx.selectItem(ctx.activeValue);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			ctx.close();
		}
	};

	return (
		<input
			type='text'
			role='combobox'
			autocomplete='off'
			autocorrect='off'
			spellcheck={false}
			aria-expanded={true}
			aria-controls={ctx.listboxId}
			aria-activedescendant={activeId()}
			value={ctx.query}
			class={local.class}
			{...rest}
			onInput={(e) => ctx.setQuery(e.currentTarget.value)}
			onKeyDown={handleKeyDown}
		/>
	);
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function List(props: CommandListProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useCommandContext();
	return (
		<div
			role='listbox'
			id={ctx.listboxId}
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

function Group(props: CommandGroupProps) {
	const [local, rest] = splitProps(props, ['heading', 'class', 'children']);
	const ctx = useCommandContext();
	const groupId = createId('command-group');
	const hasVisible = () => ctx.groupHasVisible(groupId);
	const headingId = `${groupId}-heading`;

	const groupCtx: CommandGroupContextValue = { groupId };

	return (
		<CommandGroupContext.Provider value={groupCtx}>
			<div
				role='group'
				aria-labelledby={local.heading != null ? headingId : undefined}
				hidden={!hasVisible() ? true : undefined}
				class={local.class}
				{...rest}>
				<Show when={local.heading != null}>
					<div
						id={headingId}
						data-command-group-heading=''
						aria-hidden='true'>
						{local.heading}
					</div>
				</Show>
				{local.children}
			</div>
		</CommandGroupContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function Item(props: CommandItemProps) {
	const [local, rest] = splitProps(props, ['value', 'keywords', 'disabled', 'onSelect', 'class', 'children']);
	const ctx = useCommandContext();
	const group = useContext(CommandGroupContext);

	const disabled = () => local.disabled ?? false;

	// Registration captures identity (value/keywords/disabled) at setup; `onSelect`
	// is read lazily via the getter so it always sees the latest handler.
	/* eslint-disable solid/reactivity */
	const dispose = ctx.registerItem(local.value, {
		keywords: local.keywords ?? [],
		disabled: disabled(),
		groupId: group?.groupId,
		getOnSelect: () => local.onSelect,
	});
	/* eslint-enable solid/reactivity */
	onCleanup(dispose);

	const active = () => ctx.isActive(local.value);

	const callUserHandler = <E,>(handler: unknown, e: E) => {
		if (typeof handler === 'function') (handler as (event: E) => void)(e);
	};

	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		if (!disabled()) ctx.setActiveValue(local.value);
		callUserHandler(rest.onPointerMove, e);
	};
	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!disabled()) ctx.selectItem(local.value);
		callUserHandler(rest.onClick, e);
	};

	return (
		<Show when={ctx.isVisible(local.value)}>
			<div
				role='option'
				id={ctx.getItemId(local.value)}
				aria-selected={active()}
				aria-disabled={disabled() || undefined}
				data-active={active() ? '' : undefined}
				data-disabled={disabled() ? '' : undefined}
				class={local.class}
				{...rest}
				onPointerMove={handlePointerMove}
				onClick={handleClick}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

function Separator(props: CommandSeparatorProps) {
	const [local, rest] = splitProps(props, ['class']);
	const ctx = useCommandContext();
	// Separators are noise while filtering.
	// `role="separator"` is not an allowed child of `role="listbox"` (per the ARIA
	// listbox spec, which permits only `option` and `group`). The divider is purely
	// a visual cue between groups, so it is presentational and carries no semantics.
	return (
		<Show when={!ctx.searching}>
			<div
				role='none'
				class={local.class}
				{...rest}
			/>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

function Empty(props: CommandEmptyProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useCommandContext();
	return (
		<Show when={ctx.visible.length === 0}>
			<div
				role='presentation'
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Command = {
	Root,
	Input,
	List,
	Group,
	Item,
	Separator,
	Empty,
};

export { Root, Input, List, Group, Item, Separator, Empty };
