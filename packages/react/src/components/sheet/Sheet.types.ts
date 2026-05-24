import React from 'react';

export type SheetSide = 'top' | 'bottom';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface SheetContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	side: SheetSide;
	modal: boolean;
	dismissible: boolean;
	/** Resolved snap sizes in px (smallest → largest). */
	snapSizes: number[];
	/** Hidden offset in px for each snap (largest snap = 0). */
	snapOffsets: number[];
	maxSize: number;
	closedOffset: number;
	activeSnap: number;
	setActiveSnap: (index: number) => void;
	/** Current hidden offset while dragging, else `null`. */
	dragOffset: number | null;
	startDrag: (clientX: number, clientY: number) => void;
	moveDrag: (clientX: number, clientY: number) => void;
	endDrag: () => void;
	contentRef: React.RefObject<HTMLDivElement | null>;
	titleId: string;
	descriptionId: string;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface SheetRootProps {
	children: React.ReactNode;
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** Edge the sheet slides from. Default `'bottom'`. */
	side?: SheetSide;
	/**
	 * Rest positions. Values ≤ 1 are a fraction of the viewport; values > 1 are px.
	 * Order them smallest → largest. Default `[1]` (a single full-size stop).
	 */
	snapPoints?: number[];
	/** Controlled active snap index. */
	activeSnapPoint?: number;
	/** Initial active snap index. Defaults to the largest snap. */
	defaultActiveSnapPoint?: number;
	/** Called when the active snap index changes. */
	onActiveSnapPointChange?: (index: number) => void;
	/** Render a focus-trapping, scroll-locking modal. Default `true`. */
	modal?: boolean;
	/** Allow closing by dragging past the smallest snap, Escape, or overlay click. Default `true`. */
	dismissible?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type SheetTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface SheetPortalProps {
	children: React.ReactNode;
	container?: Element | null;
}

export type SheetOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export type SheetContentProps = React.HTMLAttributes<HTMLDivElement>;

export type SheetHandleProps = React.HTMLAttributes<HTMLDivElement>;

export type SheetTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export type SheetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export type SheetCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
