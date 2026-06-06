'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { getDirection } from '@/hooks/use-direction';
import { useId } from '@/hooks/use-id';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type {
	ToolbarButtonProps,
	ToolbarContextValue,
	ToolbarLinkProps,
	ToolbarRootProps,
	ToolbarSeparatorProps,
	ToolbarToggleProps,
} from './Toolbar.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

function useToolbarContext() {
	const ctx = useContext(ToolbarContext);
	if (!ctx) throw new globalThis.Error('Toolbar sub-components must be used within Toolbar.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
	({ orientation = 'horizontal', loop = true, className, children, ...rest }, ref) => {
		const itemsRef = useRef<Array<{ id: string; el: HTMLElement }>>([]);
		const [activeId, setActiveId] = useState<string | null>(null);
		const activeIdRef = useRef<string | null>(null);
		useEffect(() => {
			activeIdRef.current = activeId;
		}, [activeId]);

		const register = useCallback((id: string, el: HTMLElement) => {
			itemsRef.current.push({ id, el });
			if (activeIdRef.current === null) {
				activeIdRef.current = id;
				setActiveId(id);
			}
			return () => {
				itemsRef.current = itemsRef.current.filter((it) => it.id !== id);
				if (activeIdRef.current === id) {
					const fallback = itemsRef.current[0]?.id ?? null;
					activeIdRef.current = fallback;
					setActiveId(fallback);
				}
			};
		}, []);

		const isTabbable = useCallback((id: string) => activeId === id, [activeId]);

		const onItemFocus = useCallback((id: string) => {
			activeIdRef.current = id;
			setActiveId(id);
		}, []);

		const orderedEnabled = useCallback(() => {
			return [...itemsRef.current]
				.filter(
					(it) => !(it.el as HTMLButtonElement).disabled && it.el.getAttribute('aria-disabled') !== 'true',
				)
				.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
		}, []);

		const onItemKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				const horizontal = orientation === 'horizontal';
				const rtl = horizontal && getDirection(e.currentTarget) === 'rtl';
				const nextKey = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
				const prevKey = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
				if (!['Home', 'End', nextKey, prevKey].includes(e.key)) return;

				const items = orderedEnabled();
				if (items.length === 0) return;
				const currentIndex = items.findIndex((it) => it.el === document.activeElement);

				let nextIndex = currentIndex;
				if (e.key === nextKey) {
					nextIndex = currentIndex + 1;
					if (nextIndex >= items.length) nextIndex = loop ? 0 : items.length - 1;
				} else if (e.key === prevKey) {
					nextIndex = currentIndex - 1;
					if (nextIndex < 0) nextIndex = loop ? items.length - 1 : 0;
				} else if (e.key === 'Home') {
					nextIndex = 0;
				} else if (e.key === 'End') {
					nextIndex = items.length - 1;
				}

				const target = items[nextIndex];
				if (target) {
					e.preventDefault();
					target.el.focus();
					onItemFocus(target.id);
				}
			},
			[orientation, loop, orderedEnabled, onItemFocus],
		);

		const ctx = useMemo<ToolbarContextValue>(
			() => ({ orientation, isTabbable, register, onItemFocus, onItemKeyDown }),
			[orientation, isTabbable, register, onItemFocus, onItemKeyDown],
		);

		return (
			<ToolbarContext.Provider value={ctx}>
				<div
					ref={ref}
					role='toolbar'
					aria-orientation={orientation}
					className={className}
					data-orientation={orientation}
					{...rest}>
					{children}
				</div>
			</ToolbarContext.Provider>
		);
	},
);

Root.displayName = 'Toolbar.Root';

// ---------------------------------------------------------------------------
// Shared roving-item hook
// ---------------------------------------------------------------------------

function useRovingItem<T extends HTMLElement>(forwardedRef: React.Ref<T>) {
	const ctx = useToolbarContext();
	const id = useId('toolbar-item');
	const innerRef = useRef<T | null>(null);
	const mergedRef = useMergedRefs(innerRef, forwardedRef);

	// Depend only on the stable `register` — not the whole context — so a change
	// in `activeId` doesn't churn registration (which would reset the roving anchor).
	const { register } = ctx;
	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;
		return register(id, el);
	}, [register, id]);

	return { ctx, id, mergedRef };
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

const Button = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
	({ className, onFocus, onKeyDown, ...rest }, ref) => {
		const { ctx, id, mergedRef } = useRovingItem<HTMLButtonElement>(ref);
		return (
			<button
				ref={mergedRef}
				type='button'
				tabIndex={ctx.isTabbable(id) ? 0 : -1}
				data-toolbar-item=''
				className={className}
				{...rest}
				onFocus={(e) => {
					ctx.onItemFocus(id);
					onFocus?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (!e.defaultPrevented) ctx.onItemKeyDown(e);
				}}
			/>
		);
	},
);

Button.displayName = 'Toolbar.Button';

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

const Toggle = React.forwardRef<HTMLButtonElement, ToolbarToggleProps>(
	(
		{
			pressed: controlledPressed,
			defaultPressed = false,
			onPressedChange,
			disabled,
			className,
			onClick,
			onFocus,
			onKeyDown,
			...rest
		},
		ref,
	) => {
		const { ctx, id, mergedRef } = useRovingItem<HTMLButtonElement>(ref);
		const [pressed, setPressed] = useControllableState({
			value: controlledPressed,
			defaultValue: defaultPressed,
			onChange: onPressedChange,
		});

		return (
			<button
				ref={mergedRef}
				type='button'
				disabled={disabled}
				tabIndex={ctx.isTabbable(id) ? 0 : -1}
				aria-pressed={pressed}
				data-toolbar-item=''
				data-state={pressed ? 'on' : 'off'}
				className={className}
				{...rest}
				onClick={(e) => {
					if (!disabled) setPressed(!pressed);
					onClick?.(e);
				}}
				onFocus={(e) => {
					ctx.onItemFocus(id);
					onFocus?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (!e.defaultPrevented) ctx.onItemKeyDown(e);
				}}
			/>
		);
	},
);

Toggle.displayName = 'Toolbar.Toggle';

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

const Link = React.forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
	({ className, onFocus, onKeyDown, ...rest }, ref) => {
		const { ctx, id, mergedRef } = useRovingItem<HTMLAnchorElement>(ref);
		return (
			<a
				ref={mergedRef}
				tabIndex={ctx.isTabbable(id) ? 0 : -1}
				data-toolbar-item=''
				className={className}
				{...rest}
				onFocus={(e) => {
					ctx.onItemFocus(id);
					onFocus?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (!e.defaultPrevented) ctx.onItemKeyDown(e);
				}}
			/>
		);
	},
);

Link.displayName = 'Toolbar.Link';

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
	({ orientation, className, ...rest }, ref) => {
		const ctx = useToolbarContext();
		// A separator's visual orientation is perpendicular to the toolbar's axis.
		const o = orientation ?? (ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal');
		return (
			<div
				ref={ref}
				role='separator'
				aria-orientation={o}
				className={className}
				data-orientation={o}
				{...rest}
			/>
		);
	},
);

Separator.displayName = 'Toolbar.Separator';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Toolbar = {
	Root,
	Button,
	Toggle,
	Link,
	Separator,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Toolbar.*`).
export { Root, Button, Toggle, Link, Separator };
