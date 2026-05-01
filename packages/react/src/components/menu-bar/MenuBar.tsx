import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useInteractiveState } from '@/hooks/use-interactive-state';
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
		const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue);
		const isControlled = controlledValue !== undefined;
		const openMenu = isControlled ? (controlledValue as string | null) : uncontrolled;

		const orderRef = useRef<string[]>([]);

		const setOpenMenu = useCallback(
			(next: string | null) => {
				if (!isControlled) setUncontrolled(next);
				onValueChange?.(next);
			},
			[isControlled, onValueChange],
		);

		const registerMenu = useCallback((id: string) => {
			if (!orderRef.current.includes(id)) orderRef.current.push(id);
		}, []);

		const unregisterMenu = useCallback((id: string) => {
			orderRef.current = orderRef.current.filter((v) => v !== id);
		}, []);

		const getMenuOrder = useCallback(() => orderRef.current.slice(), []);

		const internalRef = useRef<HTMLDivElement | null>(null);
		const setMergedRef = (el: HTMLDivElement | null) => {
			internalRef.current = el;
			if (typeof ref === 'function') ref(el);
			else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
		};

		useClickOutside(internalRef, () => {
			if (openMenu) setOpenMenu(null);
		});

		useEffect(() => {
			const handle = (e: KeyboardEvent) => {
				if (e.key === 'Escape' && openMenu) setOpenMenu(null);
			};
			window.addEventListener('keyup', handle);
			return () => window.removeEventListener('keyup', handle);
		}, [openMenu, setOpenMenu]);

		const ctx = useMemo<MenuBarContextValue>(
			() => ({ openMenu, setOpenMenu, registerMenu, unregisterMenu, getMenuOrder }),
			[openMenu, setOpenMenu, registerMenu, unregisterMenu, getMenuOrder],
		);

		return (
			<MenuBarContext.Provider value={ctx}>
				<div
					ref={setMergedRef}
					role='menubar'
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
	({ disabled = false, children, className, onClick, onPointerEnter, ...rest }, ref) => {
		const bar = useBarContext();
		const menu = useMenuContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-haspopup='menu'
				aria-expanded={menu.open}
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
	({ children, className, ...rest }, ref) => {
		const menu = useMenuContext();
		if (!menu.open) return null;

		return (
			<div
				ref={ref}
				role='menu'
				className={className}
				data-state='open'
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
				tabIndex={disabled ? -1 : 0}
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
