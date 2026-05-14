import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	NavigationMenuContentProps,
	NavigationMenuItemContextValue,
	NavigationMenuItemProps,
	NavigationMenuLinkProps,
	NavigationMenuListProps,
	NavigationMenuRootContextValue,
	NavigationMenuRootProps,
	NavigationMenuTriggerProps,
} from './NavigationMenu.types';

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

const RootContext = createContext<NavigationMenuRootContextValue | null>(null);
const ItemContext = createContext<NavigationMenuItemContextValue | null>(null);

function useRootContext() {
	const ctx = useContext(RootContext);
	if (!ctx) throw new globalThis.Error('NavigationMenu compound components must be used within NavigationMenu.Root');
	return ctx;
}

function useItemContext() {
	const ctx = useContext(ItemContext);
	if (!ctx) throw new globalThis.Error('NavigationMenu.Trigger / Content must be used within NavigationMenu.Item');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLElement, NavigationMenuRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = null,
			onValueChange,
			delayDuration = 100,
			skipDelayDuration = 300,
			children,
			className,
			'aria-label': ariaLabel = 'Main',
			...rest
		},
		ref,
	) => {
		const [value, setValueState] = useControllableState<string | null>({
			value: controlledValue,
			defaultValue,
			onChange: onValueChange,
		});

		const setValue = useCallback((next: string | null) => setValueState(next), [setValueState]);

		const internalRef = useRef<HTMLElement | null>(null);
		const mergedRef = useMergedRefs<HTMLElement>(internalRef, ref);

		useClickOutside(internalRef as React.RefObject<HTMLElement | null>, () => {
			if (value) setValue(null);
		});

		useKeyboard(
			{
				Escape: () => {
					if (value) setValue(null);
				},
			},
			{ event: 'keyup' },
		);

		const ctx = useMemo<NavigationMenuRootContextValue>(
			() => ({ value: value ?? null, setValue, delayDuration, skipDelayDuration }),
			[value, setValue, delayDuration, skipDelayDuration],
		);

		return (
			<RootContext.Provider value={ctx}>
				<nav
					ref={mergedRef}
					aria-label={ariaLabel}
					className={className}
					{...rest}>
					{children}
				</nav>
			</RootContext.Provider>
		);
	},
);
Root.displayName = 'NavigationMenu.Root';

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

const List = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(({ children, className, ...rest }, ref) => (
	<ul
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</ul>
));
List.displayName = 'NavigationMenu.List';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
	({ value, children, className, ...rest }, ref) => {
		const ctx = useMemo<NavigationMenuItemContextValue | null>(
			() => (value ? { value } : null),
			[value],
		);

		const node = (
			<li
				ref={ref}
				className={className}
				{...rest}>
				{children}
			</li>
		);

		if (!ctx) return node;
		return <ItemContext.Provider value={ctx}>{node}</ItemContext.Provider>;
	},
);
Item.displayName = 'NavigationMenu.Item';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
	({ disabled = false, children, className, onClick, onPointerEnter, onPointerLeave, ...rest }, ref) => {
		const root = useRootContext();
		const item = useItemContext();
		const open = root.value === item.value;
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
		const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

		const clearTimers = () => {
			if (openTimer.current) clearTimeout(openTimer.current);
			if (closeTimer.current) clearTimeout(closeTimer.current);
		};

		useEffect(() => () => clearTimers(), []);

		return (
			<button
				ref={ref}
				type='button'
				disabled={disabled}
				aria-haspopup='menu'
				aria-expanded={open}
				className={className}
				data-state={open ? 'open' : 'closed'}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					clearTimers();
					root.setValue(open ? null : item.value);
					onClick?.(e);
				}}
				onPointerEnter={(e) => {
					clearTimers();
					if (root.value !== null && root.value !== item.value) {
						// Switch immediately when another menu is already open.
						root.setValue(item.value);
					} else {
						openTimer.current = setTimeout(() => root.setValue(item.value), root.delayDuration);
					}
					onPointerEnter?.(e);
				}}
				onPointerLeave={(e) => {
					clearTimers();
					closeTimer.current = setTimeout(() => {
						if (root.value === item.value) root.setValue(null);
					}, root.skipDelayDuration);
					onPointerLeave?.(e);
				}}>
				{children}
			</button>
		);
	},
);
Trigger.displayName = 'NavigationMenu.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
	({ children, className, onPointerEnter, onPointerLeave, ...rest }, ref) => {
		const root = useRootContext();
		const item = useItemContext();
		const open = root.value === item.value;

		const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

		if (!open) return null;

		return (
			<div
				ref={ref}
				role='menu'
				className={className}
				data-state='open'
				{...rest}
				onPointerEnter={(e) => {
					if (closeTimer.current) clearTimeout(closeTimer.current);
					onPointerEnter?.(e);
				}}
				onPointerLeave={(e) => {
					closeTimer.current = setTimeout(() => {
						if (root.value === item.value) root.setValue(null);
					}, root.skipDelayDuration);
					onPointerLeave?.(e);
				}}>
				{children}
			</div>
		);
	},
);
Content.displayName = 'NavigationMenu.Content';

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

const Link = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
	({ active = false, children, className, ...rest }, ref) => (
		<a
			ref={ref}
			aria-current={active ? 'page' : undefined}
			data-active={active ? '' : undefined}
			className={className}
			{...rest}>
			{children}
		</a>
	),
);
Link.displayName = 'NavigationMenu.Link';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const NavigationMenu = { Root, List, Item, Trigger, Content, Link };
