'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMenuNavigation } from '@/hooks/use-menu-navigation';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
	if (!ctx) throw new globalThis.Error('MenuBar compound components must be used within MenuBar.Root');
	return ctx;
}

function useMenuContext() {
	const ctx = useContext(MenuContext);
	if (!ctx) throw new globalThis.Error('MenuBar.Trigger / Content must be used within MenuBar.Menu');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, MenuBarRootProps>(
	({ value: controlledValue, defaultValue = null, onValueChange, children, className, ...rest }, ref) => {
		const [openMenu, setOpenMenuState] = useControllableState<string | null>({
			value: controlledValue,
			defaultValue,
			onChange: onValueChange,
		});

		const orderRef = useRef<string[]>([]);

		const setOpenMenu = useCallback((next: string | null) => setOpenMenuState(next), [setOpenMenuState]);

		const registerMenu = useCallback((id: string) => {
			if (!orderRef.current.includes(id)) orderRef.current.push(id);
		}, []);

		const unregisterMenu = useCallback((id: string) => {
			orderRef.current = orderRef.current.filter((v) => v !== id);
		}, []);

		const getMenuOrder = useCallback(() => orderRef.current.slice(), []);

		const internalRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, ref);

		useClickOutside(internalRef, () => {
			if (openMenu) setOpenMenu(null);
		});

		useKeyboard(
			{
				Escape: () => {
					if (openMenu) setOpenMenu(null);
				},
			},
			{ event: 'keyup' },
		);

		const ctx = useMemo<MenuBarContextValue>(
			() => ({ openMenu: openMenu ?? null, setOpenMenu, registerMenu, unregisterMenu, getMenuOrder }),
			[openMenu, setOpenMenu, registerMenu, unregisterMenu, getMenuOrder],
		);

		return (
			<MenuBarContext.Provider value={ctx}>
				<div
					ref={mergedRef}
					role='menubar'
					aria-orientation='horizontal'
					className={className}
					{...rest}>
					{children}
				</div>
			</MenuBarContext.Provider>
		);
	},
);
Root.displayName = 'MenuBar.Root';

// ---------------------------------------------------------------------------
// Menu (single dropdown column — File, Edit, etc)
// ---------------------------------------------------------------------------

const Menu = React.forwardRef<HTMLDivElement, MenuBarMenuProps>(
	({ value, children, className, ...rest }, ref) => {
		const bar = useBarContext();
		const open = bar.openMenu === value;

		useEffect(() => {
			bar.registerMenu(value);
			return () => bar.unregisterMenu(value);
		}, [value, bar]);

		const close = useCallback(() => bar.setOpenMenu(null), [bar]);
		const open_ = useCallback(() => bar.setOpenMenu(value), [bar, value]);
		const toggle = useCallback(() => bar.setOpenMenu(open ? null : value), [bar, open, value]);

		const menuCtx = useMemo<MenuBarMenuContextValue>(
			() => ({ value, open, close, open_, toggle }),
			[value, open, close, open_, toggle],
		);

		return (
			<MenuContext.Provider value={menuCtx}>
				<div
					ref={ref}
					role='none'
					className={className}
					data-state={open ? 'open' : 'closed'}
					{...rest}>
					{children}
				</div>
			</MenuContext.Provider>
		);
	},
);
Menu.displayName = 'MenuBar.Menu';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, MenuBarTriggerProps>(
	({ disabled = false, children, className, onClick, onPointerEnter, onKeyDown, ...rest }, ref) => {
		const bar = useBarContext();
		const menu = useMenuContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		// Move focus between top-level triggers; if a menu is already open, opening
		// follows focus (APG Menubar).
		const focusSibling = (current: HTMLElement, delta: number) => {
			const menubarEl = current.closest('[role="menubar"]');
			if (!menubarEl) return;
			const triggers = Array.from(
				menubarEl.querySelectorAll<HTMLElement>('[role="menuitem"][aria-haspopup="menu"]'),
			).filter((t) => !t.hasAttribute('disabled'));
			const idx = triggers.indexOf(current);
			if (idx < 0) return;
			const wasOpen = current.getAttribute('aria-expanded') === 'true';
			const next = triggers[(idx + delta + triggers.length) % triggers.length];
			next.focus();
			// If a menu was open, opening follows focus to the adjacent menu.
			if (wasOpen && next !== current) next.click();
		};

		return (
			<button
				ref={ref}
				type='button'
				role='menuitem'
				disabled={disabled}
				aria-haspopup='menu'
				aria-expanded={menu.open}
				data-menu-value={menu.value}
				className={className}
				data-state={menu.open ? 'open' : 'closed'}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					menu.toggle();
					onClick?.(e);
				}}
				onPointerEnter={(e) => {
					// If any other menu is open, hovering switches focus to this one.
					if (bar.openMenu && bar.openMenu !== menu.value) bar.setOpenMenu(menu.value);
					onPointerEnter?.(e);
				}}
				onKeyDown={(e) => {
					switch (e.key) {
						case 'ArrowRight':
							e.preventDefault();
							focusSibling(e.currentTarget, 1);
							break;
						case 'ArrowLeft':
							e.preventDefault();
							focusSibling(e.currentTarget, -1);
							break;
						case 'ArrowDown':
						case 'ArrowUp':
							// Open this menu; focus moves into the first submenu item.
							e.preventDefault();
							if (!menu.open) menu.open_();
							break;
					}
					onKeyDown?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Trigger.displayName = 'MenuBar.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, MenuBarContentProps>(
	({ children, className, onKeyDown, ...rest }, ref) => {
		const menu = useMenuContext();
		const contentRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(contentRef, ref);
		const { onKeyDown: onMenuKeyDown } = useMenuNavigation(contentRef, {
			open: menu.open,
			onClose: menu.close,
		});

		if (!menu.open) return null;

		return (
			<div
				ref={mergedRef}
				role='menu'
				className={className}
				data-state='open'
				onKeyDown={(e) => {
					onMenuKeyDown(e);
					onKeyDown?.(e);
				}}
				{...rest}>
				{children}
			</div>
		);
	},
);
Content.displayName = 'MenuBar.Content';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, MenuBarItemProps>(
	({ disabled = false, onSelect, children, className, onClick, onKeyDown, ...rest }, ref) => {
		const menu = useMenuContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		const select = () => {
			if (disabled) return;
			onSelect?.();
			menu.close();
		};

		return (
			<div
				ref={ref}
				role='menuitem'
				// Roving tabindex managed by useMenuNavigation on the parent menu.
				tabIndex={-1}
				aria-disabled={disabled || undefined}
				className={className}
				data-disabled={disabled ? '' : undefined}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					select();
					onClick?.(e);
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						select();
					}
					onKeyDown?.(e);
				}}>
				{children}
			</div>
		);
	},
);
Item.displayName = 'MenuBar.Item';

const Separator = React.forwardRef<HTMLDivElement, MenuBarSeparatorProps>(({ className, ...rest }, ref) => (
	<div
		ref={ref}
		role='separator'
		className={className}
		{...rest}
	/>
));
Separator.displayName = 'MenuBar.Separator';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const MenuBar = { Root, Menu, Trigger, Content, Item, Separator };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `MenuBar.*`).
export { Root, Menu, Trigger, Content, Item, Separator };
