import { createContext, onCleanup, onMount, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	MenuBarContentProps,
	MenuBarContextValue,
	MenuBarItemProps,
	MenuBarMenuContextValue,
	MenuBarMenuProps,
	MenuBarRootProps,
	MenuBarSeparatorProps,
	MenuBarTriggerProps,
} from './MenuBar.types';

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

const MenuBarContext = createContext<MenuBarContextValue | null>(null);
const MenuContext = createContext<MenuBarMenuContextValue | null>(null);

function useBarContext() {
	const ctx = useContext(MenuBarContext);
	if (!ctx) throw new Error('MenuBar compound components must be used within MenuBar.Root');
	return ctx;
}

function useMenuContext() {
	const ctx = useContext(MenuContext);
	if (!ctx) throw new Error('MenuBar.Trigger / Content must be used within MenuBar.Menu');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: MenuBarRootProps) {
	const [local, rest] = splitProps(props, ['value', 'defaultValue', 'onValueChange', 'children', 'class', 'ref']);

	const [openMenu, setOpenMenuState] = createControllableState<string | null>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? null,
		get onChange() {
			return local.onValueChange;
		},
	});

	const setOpenMenu = (next: string | null) => setOpenMenuState(next);

	const order: string[] = [];

	const registerMenu = (id: string) => {
		if (!order.includes(id)) order.push(id);
	};
	const unregisterMenu = (id: string) => {
		const idx = order.indexOf(id);
		if (idx >= 0) order.splice(idx, 1);
	};
	const getMenuOrder = () => order.slice();

	let rootEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (rootEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	createClickOutside(
		() => rootEl,
		() => {
			if (openMenu()) setOpenMenu(null);
		},
	);

	createKeyboard(
		{
			Escape: () => {
				if (openMenu()) setOpenMenu(null);
			},
		},
		{ event: 'keyup' },
	);

	const ctxValue: MenuBarContextValue = {
		get openMenu() {
			return openMenu();
		},
		setOpenMenu,
		registerMenu,
		unregisterMenu,
		getMenuOrder,
	};

	return (
		<MenuBarContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
				role='menubar'
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</MenuBarContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

function Menu(props: MenuBarMenuProps) {
	const [local, rest] = splitProps(props, ['value', 'children', 'class']);
	const bar = useBarContext();
	const open = () => bar.openMenu === local.value;

	onMount(() => {
		bar.registerMenu(local.value);
		onCleanup(() => bar.unregisterMenu(local.value));
	});

	const close = () => bar.setOpenMenu(null);
	const open_ = () => bar.setOpenMenu(local.value);
	const toggle = () => bar.setOpenMenu(open() ? null : local.value);

	const menuCtx: MenuBarMenuContextValue = {
		get value() {
			return local.value;
		},
		get open() {
			return open();
		},
		close,
		open_,
		toggle,
	};

	return (
		<MenuContext.Provider value={menuCtx}>
			<div
				class={local.class}
				data-state={open() ? 'open' : 'closed'}
				{...rest}>
				{local.children}
			</div>
		</MenuContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: MenuBarTriggerProps) {
	const [local, rest] = splitProps(props, ['disabled', 'children', 'class', 'onClick', 'onPointerEnter']);
	const bar = useBarContext();
	const menu = useMenuContext();
	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		menu.toggle();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handlePointerEnter: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
		// If any other menu is open, hovering switches focus to this one.
		if (bar.openMenu && bar.openMenu !== menu.value) bar.setOpenMenu(menu.value);
		const userOnPointerEnter = local.onPointerEnter;
		if (typeof userOnPointerEnter === 'function') {
			(userOnPointerEnter as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			disabled={local.disabled}
			aria-haspopup='menu'
			aria-expanded={menu.open}
			class={local.class}
			data-state={menu.open ? 'open' : 'closed'}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}
			onPointerEnter={handlePointerEnter}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: MenuBarContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const menu = useMenuContext();

	return (
		<Show when={menu.open}>
			<div
				role='menu'
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

function Item(props: MenuBarItemProps) {
	const [local, rest] = splitProps(props, ['disabled', 'onSelect', 'children', 'class', 'onClick', 'onKeyDown']);
	const menu = useMenuContext();
	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const select = () => {
		if (local.disabled) return;
		local.onSelect?.();
		menu.close();
	};

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		select();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			select();
		}
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			role='menuitem'
			tabIndex={local.disabled ? -1 : 0}
			aria-disabled={local.disabled || undefined}
			class={local.class}
			data-disabled={local.disabled ? '' : undefined}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}
			onKeyDown={handleKeyDown}>
			{local.children}
		</div>
	);
}

function Separator(props: MenuBarSeparatorProps) {
	const [local, rest] = splitProps(props, ['class']);
	return (
		<div
			role='separator'
			class={local.class}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const MenuBar = { Root, Menu, Trigger, Content, Item, Separator };

export { Root, Menu, Trigger, Content, Item, Separator };
