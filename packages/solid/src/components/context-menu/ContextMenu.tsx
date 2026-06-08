'use client';

import { createContext, createEffect, createSignal, onCleanup, Show, splitProps, useContext, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMenuNavigation } from '@/primitives/create-menu-navigation';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { mergeProps } from '@/utils/merge-props';
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

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
	const ctx = useContext(ContextMenuContext);
	if (!ctx) throw new Error('ContextMenu compound components must be used within ContextMenu.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: ContextMenuRootProps) {
	const [local, rest] = splitProps(props, [
		'open',
		'defaultOpen',
		'onOpenChange',
		'disabled',
		'children',
		'class',
	]);

	const [open, setOpen] = createControllableState<boolean>({
		get value() {
			return local.open;
		},
		defaultValue: local.defaultOpen ?? false,
		get onChange() {
			return local.onOpenChange;
		},
	});
	const [position, setPosition] = createSignal({ x: 0, y: 0 });

	const openAt = (x: number, y: number) => {
		setPosition({ x, y });
		setOpen(true);
	};

	const close = () => setOpen(false);

	let contentEl: HTMLDivElement | null = null;
	const setContentEl = (el: HTMLDivElement | null) => {
		contentEl = el;
	};
	const getContentEl = () => contentEl;

	// Close on any pointer activity outside the menu content.
	createEffect(() => {
		if (!open()) return;
		const handlePointer = (e: MouseEvent | TouchEvent) => {
			const target = e.target as Node | null;
			if (!target) return;
			if (contentEl?.contains(target)) return;
			close();
		};
		document.addEventListener('mousedown', handlePointer);
		document.addEventListener('touchstart', handlePointer);
		onCleanup(() => {
			document.removeEventListener('mousedown', handlePointer);
			document.removeEventListener('touchstart', handlePointer);
		});
	});

	createKeyboard(
		{
			Escape: () => {
				if (open()) close();
			},
		},
		{ event: 'keyup' },
	);

	// Block scroll inputs while open without hiding overflow.
	createEffect(() => {
		if (!open()) return;
		if (typeof document === 'undefined') return;

		const isInsideMenu = (target: EventTarget | null) =>
			target instanceof Node && !!contentEl?.contains(target);

		const preventWheel = (e: WheelEvent) => {
			if (isInsideMenu(e.target)) return;
			e.preventDefault();
		};

		const preventTouchMove = (e: TouchEvent) => {
			if (isInsideMenu(e.target)) return;
			e.preventDefault();
		};

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
		const preventScrollKeys = (e: KeyboardEvent) => {
			if (!SCROLL_KEYS.has(e.key)) return;
			const target = e.target as HTMLElement | null;
			if (target) {
				const tag = target.tagName;
				if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
				if (contentEl?.contains(target)) return;
			}
			e.preventDefault();
		};

		document.addEventListener('wheel', preventWheel, { passive: false });
		document.addEventListener('touchmove', preventTouchMove, { passive: false });
		document.addEventListener('keydown', preventScrollKeys);
		onCleanup(() => {
			document.removeEventListener('wheel', preventWheel);
			document.removeEventListener('touchmove', preventTouchMove);
			document.removeEventListener('keydown', preventScrollKeys);
		});
	});

	const ctxValue: ContextMenuContextValue = {
		get open() {
			return open();
		},
		get disabled() {
			return !!local.disabled;
		},
		get position() {
			return position();
		},
		openAt,
		close,
		setContentEl,
		getContentEl,
	};

	return (
		<ContextMenuContext.Provider value={ctxValue}>
			<div
				class={local.class}
				data-state={open() ? 'open' : 'closed'}
				{...rest}>
				{local.children}
			</div>
		</ContextMenuContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: ContextMenuTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onContextMenu']);
	const ctx = useContextMenuContext();

	const handleContextMenu: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (!ctx.disabled) {
			e.preventDefault();
			ctx.openAt(e.clientX, e.clientY);
		}
		const userOnContextMenu = local.onContextMenu;
		if (typeof userOnContextMenu === 'function') {
			(userOnContextMenu as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			{...rest}
			onContextMenu={handleContextMenu}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: ContextMenuContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'style', 'ref', 'onKeyDown']);
	const ctx = useContextMenuContext();

	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => ctx.setContentEl(el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	const { onKeyDown: onMenuKeyDown } = createMenuNavigation(() => ctx.getContentEl(), {
		get open() {
			return ctx.open;
		},
		onClose: () => ctx.close(),
	});

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		onMenuKeyDown(e);
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
	};

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ours: JSX.CSSProperties = {
			position: 'fixed',
			left: `${ctx.position.x}px`,
			top: `${ctx.position.y}px`,
			'z-index': 50,
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<Show when={ctx.open}>
			<Portal>
				<div
					ref={mergedRef}
					role='menu'
					class={local.class}
					data-state='open'
					style={mergedStyle()}
					onKeyDown={handleKeyDown}
					{...rest}>
					{local.children}
				</div>
			</Portal>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function Item(props: ContextMenuItemProps) {
	const [local, rest] = splitProps(props, ['disabled', 'onSelect', 'children', 'class', 'onClick', 'onKeyDown']);
	const ctx = useContextMenuContext();
	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});
	const merged = mergeProps(rest, state.handlers);

	const select = () => {
		if (local.disabled) return;
		local.onSelect?.();
		ctx.close();
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
			// Roving tabindex: createMenuNavigation makes exactly one item tabbable and
			// moves focus with the arrow keys, so Tab exits the menu.
			tabIndex={-1}
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

function Separator(props: ContextMenuSeparatorProps) {
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

export const ContextMenu = { Root, Trigger, Content, Item, Separator };

export { Root, Trigger, Content, Item, Separator };