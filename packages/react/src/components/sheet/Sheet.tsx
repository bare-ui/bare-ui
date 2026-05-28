import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useId } from '@/hooks/use-id';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { useScrollLock } from '@/hooks/use-scroll-lock';
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
	if (!ctx) throw new globalThis.Error('Sheet sub-components must be used within Sheet.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root: React.FC<SheetRootProps> = ({
	children,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	side = 'bottom',
	snapPoints = [1],
	activeSnapPoint,
	defaultActiveSnapPoint,
	onActiveSnapPointChange,
	modal = true,
	dismissible = true,
}) => {
	const [open, setOpen] = useControllableState({
		value: controlledOpen,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});

	const [activeSnap, setActiveSnap] = useControllableState({
		value: activeSnapPoint,
		defaultValue: defaultActiveSnapPoint ?? snapPoints.length - 1,
		onChange: onActiveSnapPointChange,
	});

	const [viewport, setViewport] = useState(0);
	useIsomorphicLayoutEffect(() => {
		const read = () => setViewport(window.innerHeight);
		read();
		window.addEventListener('resize', read);
		return () => window.removeEventListener('resize', read);
	}, []);

	const snapSizes = useMemo(
		() => snapPoints.map((p) => (p <= 1 ? p * viewport : p)),
		[snapPoints, viewport],
	);
	const maxSize = snapSizes.length ? Math.max(...snapSizes) : viewport;
	const closedOffset = maxSize;
	const snapOffsets = useMemo(() => snapSizes.map((s) => maxSize - s), [snapSizes, maxSize]);

	const [dragOffset, setDragOffset] = useState<number | null>(null);
	const dragStart = useRef<{ x: number; y: number; offset: number } | null>(null);

	const currentOffset = open ? snapOffsets[clamp(activeSnap, 0, snapOffsets.length - 1)] ?? 0 : closedOffset;

	const startDrag = useCallback(
		(clientX: number, clientY: number) => {
			dragStart.current = { x: clientX, y: clientY, offset: currentOffset };
			setDragOffset(currentOffset);
		},
		[currentOffset],
	);

	const moveDrag = useCallback(
		(_clientX: number, clientY: number) => {
			const start = dragStart.current;
			if (!start) return;
			const delta = offsetDelta(side, clientY - start.y);
			const max = dismissible ? closedOffset : Math.max(...snapOffsets, 0);
			setDragOffset(clamp(start.offset + delta, 0, max));
		},
		[side, dismissible, closedOffset, snapOffsets],
	);

	const endDrag = useCallback(() => {
		const start = dragStart.current;
		dragStart.current = null;
		if (dragOffset === null || !start) {
			setDragOffset(null);
			return;
		}
		const smallestVisibleOffset = Math.max(...snapOffsets, 0);
		const closeThreshold = smallestVisibleOffset + (closedOffset - smallestVisibleOffset) / 2;

		if (dismissible && dragOffset > closeThreshold) {
			setDragOffset(null);
			setOpen(false);
			return;
		}

		// Snap to the nearest open position.
		let nearest = 0;
		let best = Infinity;
		snapOffsets.forEach((o, i) => {
			const dist = Math.abs(dragOffset - o);
			if (dist < best) {
				best = dist;
				nearest = i;
			}
		});
		setDragOffset(null);
		setActiveSnap(nearest);
	}, [dragOffset, snapOffsets, closedOffset, dismissible, setOpen, setActiveSnap]);

	useKeyboard({
		Escape: () => {
			if (open && dismissible) setOpen(false);
		},
	});
	useScrollLock(open && modal);

	const contentRef = useRef<HTMLDivElement | null>(null);
	const baseId = useId('sheet');

	const ctx = useMemo<SheetContextValue>(
		() => ({
			open,
			setOpen,
			side,
			modal,
			dismissible,
			snapSizes,
			snapOffsets,
			maxSize,
			closedOffset,
			activeSnap,
			setActiveSnap,
			dragOffset,
			startDrag,
			moveDrag,
			endDrag,
			contentRef,
			titleId: `${baseId}-title`,
			descriptionId: `${baseId}-description`,
		}),
		[
			open,
			setOpen,
			side,
			modal,
			dismissible,
			snapSizes,
			snapOffsets,
			maxSize,
			closedOffset,
			activeSnap,
			setActiveSnap,
			dragOffset,
			startDrag,
			moveDrag,
			endDrag,
			baseId,
		],
	);

	return <SheetContext.Provider value={ctx}>{children}</SheetContext.Provider>;
};

Root.displayName = 'Sheet.Root';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const ctx = useSheetContext();
		const { handlers, dataAttributes } = useInteractiveState();
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);
		return (
			<button
				ref={ref}
				type='button'
				aria-haspopup='dialog'
				aria-expanded={ctx.open}
				className={className}
				{...dataAttributes}
				{...merged}
				onClick={(e) => {
					ctx.setOpen(true);
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Trigger.displayName = 'Sheet.Trigger';

// ---------------------------------------------------------------------------
// Portal
// ---------------------------------------------------------------------------

const Portal: React.FC<SheetPortalProps> = ({ children, container }) => {
	const ctx = useSheetContext();
	if (!ctx.open) return null;
	return createPortal(children, container || document.body);
};

Portal.displayName = 'Sheet.Portal';

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

const Overlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(({ className, onClick, ...rest }, ref) => {
	const ctx = useSheetContext();
	return (
		<div
			ref={ref}
			className={className}
			data-state={ctx.open ? 'open' : 'closed'}
			{...rest}
			onClick={(e) => {
				if (ctx.dismissible) ctx.setOpen(false);
				onClick?.(e);
			}}
		/>
	);
});

Overlay.displayName = 'Sheet.Overlay';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLDivElement, SheetContentProps>(({ className, style, children, ...rest }, ref) => {
	const ctx = useSheetContext();
	const mergedRef = useMergedRefs(ctx.contentRef, ref);
	useFocusTrap(ctx.contentRef, { active: ctx.open && ctx.modal });

	const rawOffset =
		ctx.dragOffset ??
		(ctx.open ? ctx.snapOffsets[clamp(ctx.activeSnap, 0, ctx.snapOffsets.length - 1)] ?? 0 : ctx.closedOffset);
	// Avoid sub-pixel floating-point noise in the transform string.
	const offset = Math.round(rawOffset * 100) / 100;

	const anchor: React.CSSProperties =
		ctx.side === 'top' ?
			{ left: 0, right: 0, top: 0, height: ctx.maxSize }
		:	{ left: 0, right: 0, bottom: 0, height: ctx.maxSize };

	return (
		<div
			ref={mergedRef}
			role='dialog'
			aria-modal={ctx.modal || undefined}
			aria-labelledby={ctx.titleId}
			aria-describedby={ctx.descriptionId}
			tabIndex={-1}
			className={className}
			data-state={ctx.open ? 'open' : 'closed'}
			data-side={ctx.side}
			data-dragging={ctx.dragOffset !== null ? '' : undefined}
			style={{ position: 'fixed', ...anchor, transform: transformFor(ctx.side, offset), ...style }}
			onClick={(e) => e.stopPropagation()}
			{...rest}>
			{children}
		</div>
	);
});

Content.displayName = 'Sheet.Content';

// ---------------------------------------------------------------------------
// Handle (drag affordance)
// ---------------------------------------------------------------------------

const Handle = React.forwardRef<HTMLDivElement, SheetHandleProps>(
	({ className, style, onPointerDown, onPointerMove, onPointerUp, ...rest }, ref) => {
		const ctx = useSheetContext();
		return (
			<div
				ref={ref}
				role='button'
				aria-label='Drag to resize'
				data-sheet-handle=''
				className={className}
				style={{ touchAction: 'none', ...style }}
				{...rest}
				onPointerDown={(e) => {
					(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
					ctx.startDrag(e.clientX, e.clientY);
					onPointerDown?.(e);
				}}
				onPointerMove={(e) => {
					ctx.moveDrag(e.clientX, e.clientY);
					onPointerMove?.(e);
				}}
				onPointerUp={(e) => {
					(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
					ctx.endDrag();
					onPointerUp?.(e);
				}}
				onPointerCancel={() => ctx.endDrag()}
			/>
		);
	},
);

Handle.displayName = 'Sheet.Handle';

// ---------------------------------------------------------------------------
// Title / Description / Close
// ---------------------------------------------------------------------------

const Title = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(({ className, children, ...rest }, ref) => {
	const ctx = useSheetContext();
	return (
		<h2
			ref={ref}
			id={ctx.titleId}
			className={className}
			{...rest}>
			{children}
		</h2>
	);
});

Title.displayName = 'Sheet.Title';

const Description = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
	({ className, children, ...rest }, ref) => {
		const ctx = useSheetContext();
		return (
			<p
				ref={ref}
				id={ctx.descriptionId}
				className={className}
				{...rest}>
				{children}
			</p>
		);
	},
);

Description.displayName = 'Sheet.Description';

const Close = React.forwardRef<HTMLButtonElement, SheetCloseProps>(({ className, children, onClick, ...rest }, ref) => {
	const ctx = useSheetContext();
	const { handlers, dataAttributes } = useInteractiveState();
	const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);
	return (
		<button
			ref={ref}
			type='button'
			className={className}
			{...dataAttributes}
			{...merged}
			onClick={(e) => {
				ctx.setOpen(false);
				onClick?.(e);
			}}>
			{children}
		</button>
	);
});

Close.displayName = 'Sheet.Close';

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

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Sheet.*`).
export { Root, Trigger, Portal, Overlay, Content, Handle, Title, Description, Close };
