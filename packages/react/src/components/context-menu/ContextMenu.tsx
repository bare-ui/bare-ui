'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useEventListener } from '@/hooks/use-event-listener';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMenuNavigation } from '@/hooks/use-menu-navigation';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';

const PASSIVE_FALSE: AddEventListenerOptions = { passive: false };

const SCROLL_KEYS = new Set([
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'PageUp',
	'PageDown',
	'Home',
	'End',
	' ',
]);
import type {
	ContextMenuContentProps,
	ContextMenuContextValue,
	ContextMenuItemProps,
	ContextMenuRootProps,
	ContextMenuSeparatorProps,
	ContextMenuTriggerProps,
} from './ContextMenu.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ContextMenuInternalContext extends ContextMenuContextValue {
	contentRef: React.MutableRefObject<HTMLDivElement | null>;
}

const ContextMenuContext = createContext<ContextMenuInternalContext | null>(null);

function useContextMenuContext() {
	const ctx = useContext(ContextMenuContext);
	if (!ctx) throw new globalThis.Error('ContextMenu compound components must be used within ContextMenu.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ContextMenuRootProps>(
	(
		{
			open: controlledOpen,
			defaultOpen = false,
			onOpenChange,
			disabled = false,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [open, setOpenState] = useControllableState({
			value: controlledOpen,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		});
		const [position, setPosition] = useState({ x: 0, y: 0 });

		const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

		const openAt = useCallback(
			(x: number, y: number) => {
				setPosition({ x, y });
				setOpen(true);
			},
			[setOpen],
		);

		const close = useCallback(() => setOpen(false), [setOpen]);

		const internalRef = useRef<HTMLDivElement | null>(null);
		const contentRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(internalRef, ref);

		// Close on any pointer activity outside the menu content. Clicks on the
		// trigger wrapper, surrounding container, or anywhere else on the page
		// all dismiss the menu. (Right-clicks elsewhere on a Trigger reopen at
		// the new position via the contextmenu handler.)
		// `mousedown` runs before `contextmenu`, so re-right-clicking a Trigger
		// closes-then-reopens at the fresh cursor position.
		const docTarget = open && typeof document !== 'undefined' ? document : null;
		const handlePointer = (e: MouseEvent | TouchEvent) => {
			const target = e.target as Node | null;
			if (!target) return;
			// Only the portaled menu content keeps the menu open.
			if (contentRef.current?.contains(target)) return;
			close();
		};
		useEventListener('mousedown', handlePointer, docTarget);
		useEventListener('touchstart', handlePointer, docTarget);

		useKeyboard(
			{
				Escape: () => {
					if (open) close();
				},
			},
			{ event: 'keyup' },
		);

		// Block scroll inputs while open without hiding overflow — the scrollbar
		// stays in place (no layout shift), but mouse wheel, trackpad, touch, and
		// scroll keys all become no-ops outside the menu.
		const isInsideMenu = (target: EventTarget | null) =>
			target instanceof Node && !!contentRef.current?.contains(target);
		const preventWheel = (e: WheelEvent) => {
			if (isInsideMenu(e.target)) return;
			e.preventDefault();
		};
		const preventTouchMove = (e: TouchEvent) => {
			if (isInsideMenu(e.target)) return;
			e.preventDefault();
		};
		const preventScrollKeys = (e: KeyboardEvent) => {
			if (!SCROLL_KEYS.has(e.key)) return;
			const target = e.target as HTMLElement | null;
			if (target) {
				// Let editable elements receive the key (typing, cursor movement).
				const tag = target.tagName;
				if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
				if (contentRef.current?.contains(target)) return;
			}
			e.preventDefault();
		};
		// passive: false is required for preventDefault to take effect on these.
		useEventListener('wheel', preventWheel, docTarget, PASSIVE_FALSE);
		useEventListener('touchmove', preventTouchMove, docTarget, PASSIVE_FALSE);
		useEventListener('keydown', preventScrollKeys, docTarget);

		const ctx = useMemo(
			() => ({ open, disabled, position, openAt, close, contentRef }),
			[open, disabled, position, openAt, close],
		);

		return (
			<ContextMenuContext.Provider value={ctx}>
				<div
					ref={mergedRef}
					className={className}
					data-state={open ? 'open' : 'closed'}
					{...rest}>
					{children}
				</div>
			</ContextMenuContext.Provider>
		);
	},
);
Root.displayName = 'ContextMenu.Root';

// ---------------------------------------------------------------------------
// Trigger (catches the contextmenu event)
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
	({ children, className, onContextMenu, ...rest }, ref) => {
		const ctx = useContextMenuContext();

		return (
			<div
				ref={ref}
				className={className}
				data-state={ctx.open ? 'open' : 'closed'}
				{...rest}
				onContextMenu={(e) => {
					if (!ctx.disabled) {
						e.preventDefault();
						ctx.openAt(e.clientX, e.clientY);
					}
					onContextMenu?.(e);
				}}>
				{children}
			</div>
		);
	},
);
Trigger.displayName = 'ContextMenu.Trigger';

// ---------------------------------------------------------------------------
// Content (positioned at the cursor)
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
	({ children, className, style, onKeyDown, ...rest }, ref) => {
		const ctx = useContextMenuContext();
		const mergedRef = useMergedRefs<HTMLDivElement>(ctx.contentRef, ref);
		const { onKeyDown: onMenuKeyDown } = useMenuNavigation(ctx.contentRef, {
			open: ctx.open,
			onClose: ctx.close,
		});

		if (!ctx.open) return null;
		if (typeof document === 'undefined') return null;

		const node = (
			<div
				ref={mergedRef}
				role='menu'
				className={className}
				data-state='open'
				style={{
					position: 'fixed',
					left: ctx.position.x,
					top: ctx.position.y,
					zIndex: 50,
					...style,
				}}
				onKeyDown={(e) => {
					onMenuKeyDown(e);
					onKeyDown?.(e);
				}}
				{...rest}>
				{children}
			</div>
		);

		// Portal to <body> so the menu escapes any transformed/contained ancestor
		// (Storybook docs containers, addon wrappers, etc.) and `position: fixed`
		// resolves against the actual viewport.
		return createPortal(node, document.body);
	},
);
Content.displayName = 'ContextMenu.Content';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

const Item = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
	({ disabled = false, onSelect, children, className, onClick, onKeyDown, ...rest }, ref) => {
		const ctx = useContextMenuContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		const select = () => {
			if (disabled) return;
			onSelect?.();
			ctx.close();
		};

		return (
			<div
				ref={ref}
				role='menuitem'
				// Roving tabindex: useMenuNavigation makes exactly one item tabbable and
				// moves focus with the arrow keys, so Tab exits the menu.
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
Item.displayName = 'ContextMenu.Item';

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
	({ className, ...rest }, ref) => (
		<div
			ref={ref}
			role='separator'
			className={className}
			{...rest}
		/>
	),
);
Separator.displayName = 'ContextMenu.Separator';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ContextMenu = { Root, Trigger, Content, Item, Separator };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `ContextMenu.*`).
export { Root, Trigger, Content, Item, Separator };
