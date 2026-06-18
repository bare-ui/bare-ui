'use client';

import { createContext, createEffect, onCleanup, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createClickOutside } from '@/primitives/create-click-outside';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
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
	if (!ctx) throw new Error('NavigationMenu compound components must be used within NavigationMenu.Root');
	return ctx;
}

function useItemContext() {
	const ctx = useContext(ItemContext);
	if (!ctx) throw new Error('NavigationMenu.Trigger / Content must be used within NavigationMenu.Item');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: NavigationMenuRootProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onValueChange',
		'delayDuration',
		'skipDelayDuration',
		'children',
		'class',
		'aria-label',
		'ref',
	]);

	const [value, setValueState] = createControllableState<string | null>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? null,
		get onChange() {
			return local.onValueChange;
		},
	});

	const setValue = (next: string | null) => setValueState(next);

	let rootEl: HTMLElement | undefined;
	const mergedRef = createMergedRefs<HTMLElement>(
		(el) => (rootEl = el),
		(el) => (local.ref as ((el: HTMLElement) => void) | undefined)?.(el),
	);

	// Single shared close timer. Without this, each Trigger and Content owns its
	// own local `closeTimer` variable — so when the cursor moves from Trigger
	// into Content, the Content's `pointerenter` clears its own (null) timer
	// while the Trigger's pending close timer keeps running and shuts the menu.
	// Hoisting the timer here lets either compound piece cancel a pending close.
	// Keyboard-open flag, mirrored from React's `focusContentOnOpenRef`. Set by a
	// Trigger ArrowDown/ArrowUp so Content focuses its first link on open; left
	// false for pointer/hover opens so the cursor isn't yanked away.
	const focusContentOnOpen = { current: false };

	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	const cancelClose = () => {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	};
	const scheduleClose = () => {
		cancelClose();
		const target = value();
		closeTimer = setTimeout(() => {
			closeTimer = null;
			if (value() === target) setValue(null);
		}, local.skipDelayDuration ?? 300);
	};
	onCleanup(cancelClose);

	createClickOutside(
		() => rootEl,
		() => {
			if (value()) setValue(null);
		},
	);

	createKeyboard(
		{
			Escape: () => {
				if (value()) setValue(null);
			},
		},
		{ event: 'keyup' },
	);

	const ctxValue: NavigationMenuRootContextValue = {
		get value() {
			return value();
		},
		setValue,
		get delayDuration() {
			return local.delayDuration ?? 100;
		},
		get skipDelayDuration() {
			return local.skipDelayDuration ?? 300;
		},
		cancelClose,
		scheduleClose,
		focusContentOnOpen,
	};

	return (
		<RootContext.Provider value={ctxValue}>
			<nav
				ref={mergedRef}
				aria-label={local['aria-label'] ?? 'Main'}
				class={local.class}
				{...rest}>
				{local.children}
			</nav>
		</RootContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function List(props: NavigationMenuListProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<ul
			class={local.class}
			{...rest}>
			{local.children}
		</ul>
	);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function Item(props: NavigationMenuItemProps) {
	const [local, rest] = splitProps(props, ['value', 'children', 'class']);

	// `value` determines whether to wrap children in the ItemContext provider;
	// this branch is determined once at setup time.
	// eslint-disable-next-line solid/reactivity
	if (!local.value) {
		// eslint-disable-next-line solid/components-return-once
		return (
			<li
				class={local.class}
				{...rest}>
				{local.children}
			</li>
		);
	}

	// Provider must wrap before children evaluate, so Trigger/Content can read
	// the ItemContext during their setup.
	const ctxValue: NavigationMenuItemContextValue = {
		get value() {
			return local.value as string;
		},
	};

	return (
		<ItemContext.Provider value={ctxValue}>
			<li
				class={local.class}
				{...rest}>
				{local.children}
			</li>
		</ItemContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: NavigationMenuTriggerProps) {
	const [local, rest] = splitProps(props, [
		'disabled',
		'children',
		'class',
		'onClick',
		'onPointerEnter',
		'onPointerLeave',
	]);
	const root = useRootContext();
	const item = useItemContext();
	const open = () => root.value === item.value;
	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});
	// Open-delay timer is per-trigger (it's tied to this element's hover intent).
	// The close timer lives on Root so Content can cancel it — see Root.
	let openTimer: ReturnType<typeof setTimeout> | null = null;
	const clearOpenTimer = () => {
		if (openTimer) clearTimeout(openTimer);
		openTimer = null;
	};
	onCleanup(clearOpenTimer);

	// ArrowDown/ArrowUp open the menu and move focus into its first link. Layered
	// after the interactive-state handlers (which only react to Enter/Space) so all
	// keydown behavior composes — consumer → interactive → this.
	const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			clearOpenTimer();
			root.cancelClose();
			root.focusContentOnOpen.current = true;
			root.setValue(item.value);
		}
	};
	const merged = mergeProps(rest, mergeProps(state.handlers, { onKeyDown: handleKeyDown }));

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		clearOpenTimer();
		root.cancelClose();
		root.setValue(open() ? null : item.value);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	const handlePointerEnter: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
		clearOpenTimer();
		root.cancelClose();
		if (root.value !== null && root.value !== item.value) {
			root.setValue(item.value);
		} else {
			openTimer = setTimeout(() => root.setValue(item.value), root.delayDuration);
		}
		const userOnPointerEnter = local.onPointerEnter;
		if (typeof userOnPointerEnter === 'function') {
			(userOnPointerEnter as (event: typeof e) => void)(e);
		}
	};

	const handlePointerLeave: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
		clearOpenTimer();
		root.scheduleClose();
		const userOnPointerLeave = local.onPointerLeave;
		if (typeof userOnPointerLeave === 'function') {
			(userOnPointerLeave as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			disabled={local.disabled}
			aria-haspopup='menu'
			aria-expanded={open()}
			class={local.class}
			data-state={open() ? 'open' : 'closed'}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const FOCUSABLE_IN_CONTENT = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

function Content(props: NavigationMenuContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onPointerEnter', 'onPointerLeave', 'onKeyDown', 'ref']);
	const root = useRootContext();
	const item = useItemContext();
	const open = () => root.value === item.value;

	let contentEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (contentEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	// When opened from the keyboard, move focus to the first link. Pointer/hover
	// opens leave the flag false so the cursor isn't yanked away. The effect tracks
	// `open()`; the flag is read imperatively (never tracked). Effects don't run on
	// the server, so this is client-only — SSR-safe.
	createEffect(() => {
		if (!open() || !root.focusContentOnOpen.current) return;
		root.focusContentOnOpen.current = false;
		contentEl?.querySelector<HTMLElement>(FOCUSABLE_IN_CONTENT)?.focus();
	});

	const returnFocusToTrigger = () => {
		const trigger = contentEl?.closest('li')?.querySelector<HTMLElement>('[aria-haspopup="menu"]');
		trigger?.focus();
	};

	const handlePointerEnter: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		// Cancel the pending close started by Trigger's pointerleave.
		// Critical: the close timer lives on Root, not on Content.
		root.cancelClose();
		const userOnPointerEnter = local.onPointerEnter;
		if (typeof userOnPointerEnter === 'function') {
			(userOnPointerEnter as (event: typeof e) => void)(e);
		}
	};

	const handlePointerLeave: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		root.scheduleClose();
		const userOnPointerLeave = local.onPointerLeave;
		if (typeof userOnPointerLeave === 'function') {
			(userOnPointerLeave as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
		// Escape closes and returns focus to the trigger (APG disclosure nav).
		if (e.key === 'Escape') {
			returnFocusToTrigger();
			root.setValue(null);
		}
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
	};

	return (
		<Show when={open()}>
			<div
				ref={mergedRef}
				role='menu'
				class={local.class}
				data-state='open'
				{...rest}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				onKeyDown={handleKeyDown}>
				{local.children}
			</div>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

function Link(props: NavigationMenuLinkProps) {
	const [local, rest] = splitProps(props, ['active', 'children', 'class']);
	return (
		<a
			aria-current={local.active ? 'page' : undefined}
			data-active={local.active ? '' : undefined}
			class={local.class}
			{...rest}>
			{local.children}
		</a>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const NavigationMenu = { Root, List, Item, Trigger, Content, Link };

export { Root, List, Item, Trigger, Content, Link };