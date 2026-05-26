import { createContext, createMemo, createSignal, onCleanup, onMount, Show, splitProps, useContext, type JSX } from 'solid-js';
import { Portal as SolidPortal } from 'solid-js/web';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createFocusTrap } from '@/primitives/create-focus-trap';
import { createId } from '@/primitives/create-id';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createKeyboard } from '@/primitives/create-keyboard';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import { createScrollLock } from '@/primitives/create-scroll-lock';
import { mergeProps } from '@/utils/merge-props';
import type {
	SheetCloseProps,
	SheetContentProps,
	SheetContextValue,
	SheetDescriptionProps,
	SheetHandleProps,
	SheetOverlayProps,
	SheetPortalProps,
	SheetRootProps,
	SheetSide,
	SheetTitleProps,
	SheetTriggerProps,
} from './Sheet.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function transformFor(side: SheetSide, offset: number): string {
	return side === 'top' ? `translateY(${-offset}px)` : `translateY(${offset}px)`;
}

/** Convert a vertical pointer delta into an increase in hidden offset for the given side. */
function offsetDelta(side: SheetSide, dy: number): number {
	return side === 'top' ? -dy : dy;
}

function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
	const ctx = useContext(SheetContext);
	if (!ctx) throw new Error('Sheet sub-components must be used within Sheet.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: SheetRootProps) {
	const side = () => props.side ?? 'bottom';
	const snapPoints = () => props.snapPoints ?? [1];
	const modal = () => props.modal ?? true;
	const dismissible = () => props.dismissible ?? true;

	const [open, setOpen] = createControllableState<boolean>({
		get value() {
			return props.open;
		},
		defaultValue: props.defaultOpen ?? false,
		get onChange() {
			return props.onOpenChange;
		},
	});

	const [activeSnap, setActiveSnap] = createControllableState<number>({
		get value() {
			return props.activeSnapPoint;
		},
		defaultValue: props.defaultActiveSnapPoint ?? snapPoints().length - 1,
		get onChange() {
			return props.onActiveSnapPointChange;
		},
	});

	const [viewport, setViewport] = createSignal(0);
	onMount(() => {
		const read = () => setViewport(window.innerHeight);
		read();
		window.addEventListener('resize', read);
		onCleanup(() => window.removeEventListener('resize', read));
	});

	const snapSizes = createMemo(() => snapPoints().map((p) => (p <= 1 ? p * viewport() : p)));
	const maxSize = () => (snapSizes().length ? Math.max(...snapSizes()) : viewport());
	const closedOffset = () => maxSize();
	const snapOffsets = createMemo(() => snapSizes().map((s) => maxSize() - s));

	const [dragOffset, setDragOffset] = createSignal<number | null>(null);
	let dragStart: { x: number; y: number; offset: number } | null = null;

	const currentOffset = () =>
		open() ? snapOffsets()[clamp(activeSnap(), 0, snapOffsets().length - 1)] ?? 0 : closedOffset();

	const startDrag = (clientX: number, clientY: number) => {
		dragStart = { x: clientX, y: clientY, offset: currentOffset() };
		setDragOffset(currentOffset());
	};

	const moveDrag = (_clientX: number, clientY: number) => {
		const start = dragStart;
		if (!start) return;
		const delta = offsetDelta(side(), clientY - start.y);
		const max = dismissible() ? closedOffset() : Math.max(...snapOffsets(), 0);
		setDragOffset(clamp(start.offset + delta, 0, max));
	};

	const endDrag = () => {
		const start = dragStart;
		dragStart = null;
		const current = dragOffset();
		if (current === null || !start) {
			setDragOffset(null);
			return;
		}
		const smallestVisibleOffset = Math.max(...snapOffsets(), 0);
		const closeThreshold = smallestVisibleOffset + (closedOffset() - smallestVisibleOffset) / 2;

		if (dismissible() && current > closeThreshold) {
			setDragOffset(null);
			setOpen(false);
			return;
		}

		// Snap to the nearest open position.
		let nearest = 0;
		let best = Infinity;
		snapOffsets().forEach((o, i) => {
			const dist = Math.abs(current - o);
			if (dist < best) {
				best = dist;
				nearest = i;
			}
		});
		setDragOffset(null);
		setActiveSnap(nearest);
	};

	createKeyboard({
		Escape: () => {
			if (open() && dismissible()) setOpen(false);
		},
	});

	createScrollLock(() => open() && modal());

	let contentEl: HTMLDivElement | undefined;
	const baseId = createId('sheet');

	const ctx: SheetContextValue = {
		get open() {
			return open();
		},
		setOpen: (value: boolean) => setOpen(value),
		get side() {
			return side();
		},
		get modal() {
			return modal();
		},
		get dismissible() {
			return dismissible();
		},
		get snapSizes() {
			return snapSizes();
		},
		get snapOffsets() {
			return snapOffsets();
		},
		get maxSize() {
			return maxSize();
		},
		get closedOffset() {
			return closedOffset();
		},
		get activeSnap() {
			return activeSnap() ?? 0;
		},
		setActiveSnap: (index: number) => setActiveSnap(index),
		get dragOffset() {
			return dragOffset();
		},
		startDrag,
		moveDrag,
		endDrag,
		setContentEl: (el: HTMLDivElement) => (contentEl = el),
		getContentEl: () => contentEl,
		titleId: `${baseId}-title`,
		descriptionId: `${baseId}-description`,
	};

	return <SheetContext.Provider value={ctx}>{props.children}</SheetContext.Provider>;
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function Trigger(props: SheetTriggerProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useSheetContext();
	const state = createInteractiveState();

	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.setOpen(true);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-haspopup='dialog'
			aria-expanded={ctx.open}
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Portal
// ---------------------------------------------------------------------------

function Portal(props: SheetPortalProps) {
	const ctx = useSheetContext();

	return (
		<Show when={ctx.open}>
			<SolidPortal mount={props.container}>{props.children}</SolidPortal>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

function Overlay(props: SheetOverlayProps) {
	const [local, rest] = splitProps(props, ['class', 'onClick']);
	const ctx = useSheetContext();

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		if (ctx.dismissible) ctx.setOpen(false);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			onClick={handleClick}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

function Content(props: SheetContentProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'style', 'onClick', 'ref']);
	const ctx = useSheetContext();

	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => ctx.setContentEl(el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	createFocusTrap(() => ctx.getContentEl(), {
		get active() {
			return ctx.open && ctx.modal;
		},
	});

	const offset = () => {
		const rawOffset =
			ctx.dragOffset ??
			(ctx.open ? ctx.snapOffsets[clamp(ctx.activeSnap, 0, ctx.snapOffsets.length - 1)] ?? 0 : ctx.closedOffset);
		// Avoid sub-pixel floating-point noise in the transform string.
		return Math.round(rawOffset * 100) / 100;
	};

	const anchor = (): JSX.CSSProperties =>
		ctx.side === 'top'
			? { left: 0, right: 0, top: 0, height: `${ctx.maxSize}px` }
			: { left: 0, right: 0, bottom: 0, height: `${ctx.maxSize}px` };

	const style = (): JSX.CSSProperties => ({
		position: 'fixed',
		...anchor(),
		transform: transformFor(ctx.side, offset()),
		...(typeof local.style === 'object' ? (local.style as JSX.CSSProperties) : {}),
	});

	const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
		e.stopPropagation();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<div
			ref={mergedRef}
			role='dialog'
			aria-modal={ctx.modal || undefined}
			aria-labelledby={ctx.titleId}
			aria-describedby={ctx.descriptionId}
			tabIndex={-1}
			class={local.class}
			data-state={ctx.open ? 'open' : 'closed'}
			data-side={ctx.side}
			data-dragging={ctx.dragOffset !== null ? '' : undefined}
			style={style()}
			onClick={handleClick}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Handle (drag affordance)
// ---------------------------------------------------------------------------

function Handle(props: SheetHandleProps) {
	const [local, rest] = splitProps(props, ['class', 'style', 'onPointerDown', 'onPointerMove', 'onPointerUp']);
	const ctx = useSheetContext();

	const style = (): JSX.CSSProperties => ({
		'touch-action': 'none',
		...(typeof local.style === 'object' ? (local.style as JSX.CSSProperties) : {}),
	});

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		ctx.startDrag(e.clientX, e.clientY);
		const user = local.onPointerDown;
		if (typeof user === 'function') (user as (event: typeof e) => void)(e);
	};

	const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		ctx.moveDrag(e.clientX, e.clientY);
		const user = local.onPointerMove;
		if (typeof user === 'function') (user as (event: typeof e) => void)(e);
	};

	const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		ctx.endDrag();
		const user = local.onPointerUp;
		if (typeof user === 'function') (user as (event: typeof e) => void)(e);
	};

	return (
		<div
			role='button'
			aria-label='Drag to resize'
			data-sheet-handle=''
			class={local.class}
			style={style()}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={() => ctx.endDrag()}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Title / Description / Close
// ---------------------------------------------------------------------------

function Title(props: SheetTitleProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useSheetContext();
	return (
		<h2
			id={ctx.titleId}
			class={local.class}
			{...rest}>
			{local.children}
		</h2>
	);
}

function Description(props: SheetDescriptionProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useSheetContext();
	return (
		<p
			id={ctx.descriptionId}
			class={local.class}
			{...rest}>
			{local.children}
		</p>
	);
}

function Close(props: SheetCloseProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const ctx = useSheetContext();
	const state = createInteractiveState();

	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.setOpen(false);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Sheet = {
	Root,
	Trigger,
	Portal,
	Overlay,
	Content,
	Handle,
	Title,
	Description,
	Close,
};
