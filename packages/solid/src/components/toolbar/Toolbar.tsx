import {
	createContext,
	createSignal,
	onCleanup,
	onMount,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createId } from '@/primitives/create-id';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type {
	ToolbarButtonProps,
	ToolbarContextValue,
	ToolbarLinkProps,
	ToolbarRootProps,
	ToolbarSeparatorProps,
} from './Toolbar.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

function useToolbarContext() {
	const ctx = useContext(ToolbarContext);
	if (!ctx) throw new Error('Toolbar sub-components must be used within Toolbar.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: ToolbarRootProps) {
	const [local, rest] = splitProps(props, ['orientation', 'loop', 'class', 'children']);

	const orientation = () => local.orientation ?? 'horizontal';
	const loop = () => local.loop ?? true;

	// --- Roving focus (same model as Toggle) ---
	const items: Array<{ id: string; el: HTMLElement }> = [];
	const [activeId, setActiveId] = createSignal<string | null>(null);

	const register = (itemId: string, el: HTMLElement) => {
		items.push({ id: itemId, el });
		if (activeId() === null) setActiveId(itemId);
		// Cleanup runs imperatively on item unregister — reading the current
		// activeId() there is intentional, not a missed tracked scope.
		// eslint-disable-next-line solid/reactivity
		return () => {
			const idx = items.findIndex((it) => it.id === itemId);
			if (idx !== -1) items.splice(idx, 1);
			if (activeId() === itemId) setActiveId(items[0]?.id ?? null);
		};
	};

	const isTabbable = (itemId: string) => activeId() === itemId;
	const onItemFocus = (itemId: string) => setActiveId(itemId);

	const orderedEnabled = () =>
		[...items]
			.filter(
				(it) =>
					!(it.el as HTMLButtonElement).disabled && it.el.getAttribute('aria-disabled') !== 'true',
			)
			.sort((a, b) =>
				a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
			);

	const onItemKeyDown = (e: KeyboardEvent) => {
		const axis = orientation();
		const nextKey = axis === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
		const prevKey = axis === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
		if (!['Home', 'End', nextKey, prevKey].includes(e.key)) return;

		const ordered = orderedEnabled();
		if (ordered.length === 0) return;
		const currentIndex = ordered.findIndex((it) => it.el === document.activeElement);

		let nextIndex = currentIndex;
		if (e.key === nextKey) {
			nextIndex = currentIndex + 1;
			if (nextIndex >= ordered.length) nextIndex = loop() ? 0 : ordered.length - 1;
		} else if (e.key === prevKey) {
			nextIndex = currentIndex - 1;
			if (nextIndex < 0) nextIndex = loop() ? ordered.length - 1 : 0;
		} else if (e.key === 'Home') {
			nextIndex = 0;
		} else if (e.key === 'End') {
			nextIndex = ordered.length - 1;
		}

		const target = ordered[nextIndex];
		if (target) {
			e.preventDefault();
			target.el.focus();
			onItemFocus(target.id);
		}
	};

	const ctx: ToolbarContextValue = {
		get orientation() {
			return orientation();
		},
		isTabbable,
		register,
		onItemFocus,
		onItemKeyDown,
	};

	return (
		<ToolbarContext.Provider value={ctx}>
			<div
				role='toolbar'
				aria-orientation={orientation()}
				class={local.class}
				data-orientation={orientation()}
				{...rest}>
				{local.children}
			</div>
		</ToolbarContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Shared roving-item setup
// ---------------------------------------------------------------------------

function useRovingItem<T extends HTMLElement>(setForwardedRef: (el: T) => void) {
	const ctx = useToolbarContext();
	const id = createId('toolbar-item');
	let innerRef: T | undefined;
	const mergedRef = createMergedRefs<T>((el) => (innerRef = el), setForwardedRef);

	onMount(() => {
		if (!innerRef) return;
		const cleanup = ctx.register(id, innerRef);
		onCleanup(() => cleanup());
	});

	return { ctx, id, mergedRef };
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

function Button(props: ToolbarButtonProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'ref', 'onFocus', 'onKeyDown']);
	const { ctx, id, mergedRef } = useRovingItem<HTMLButtonElement>((el) =>
		(local.ref as ((el: HTMLButtonElement) => void) | undefined)?.(el),
	);

	const handleFocus: JSX.EventHandler<HTMLButtonElement, FocusEvent> = (e) => {
		ctx.onItemFocus(id);
		if (typeof local.onFocus === 'function') local.onFocus(e);
	};

	const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
		if (typeof local.onKeyDown === 'function') local.onKeyDown(e);
		if (!e.defaultPrevented) ctx.onItemKeyDown(e);
	};

	return (
		<button
			ref={mergedRef}
			type='button'
			tabindex={ctx.isTabbable(id) ? 0 : -1}
			data-toolbar-item=''
			class={local.class}
			{...rest}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

function Link(props: ToolbarLinkProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'ref', 'onFocus', 'onKeyDown']);
	const { ctx, id, mergedRef } = useRovingItem<HTMLAnchorElement>((el) =>
		(local.ref as ((el: HTMLAnchorElement) => void) | undefined)?.(el),
	);

	const handleFocus: JSX.EventHandler<HTMLAnchorElement, FocusEvent> = (e) => {
		ctx.onItemFocus(id);
		if (typeof local.onFocus === 'function') local.onFocus(e);
	};

	const handleKeyDown: JSX.EventHandler<HTMLAnchorElement, KeyboardEvent> = (e) => {
		if (typeof local.onKeyDown === 'function') local.onKeyDown(e);
		if (!e.defaultPrevented) ctx.onItemKeyDown(e);
	};

	return (
		<a
			ref={mergedRef}
			tabindex={ctx.isTabbable(id) ? 0 : -1}
			data-toolbar-item=''
			class={local.class}
			{...rest}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}>
			{local.children}
		</a>
	);
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

function Separator(props: ToolbarSeparatorProps) {
	const [local, rest] = splitProps(props, ['orientation', 'class']);
	const ctx = useToolbarContext();
	// A separator's visual orientation is perpendicular to the toolbar's axis.
	const o = () =>
		local.orientation ?? (ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal');
	return (
		<div
			role='separator'
			aria-orientation={o()}
			class={local.class}
			data-orientation={o()}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Toolbar = {
	Root,
	Button,
	Link,
	Separator,
};

export { Root, Button, Link, Separator };
