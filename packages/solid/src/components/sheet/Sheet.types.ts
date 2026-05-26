import type { JSX } from 'solid-js';

export type SheetSide = 'top' | 'bottom';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface SheetContextValue {
	readonly open: boolean;
	setOpen: (open: boolean) => void;
	readonly side: SheetSide;
	readonly modal: boolean;
	readonly dismissible: boolean;
	/** Resolved snap sizes in px (smallest → largest). */
	readonly snapSizes: number[];
	/** Hidden offset in px for each snap (largest snap = 0). */
	readonly snapOffsets: number[];
	readonly maxSize: number;
	readonly closedOffset: number;
	readonly activeSnap: number;
	setActiveSnap: (index: number) => void;
	/** Current hidden offset while dragging, else `null`. */
	readonly dragOffset: number | null;
	startDrag: (clientX: number, clientY: number) => void;
	moveDrag: (clientX: number, clientY: number) => void;
	endDrag: () => void;
	setContentEl: (el: HTMLDivElement) => void;
	getContentEl: () => HTMLDivElement | undefined;
	readonly titleId: string;
	readonly descriptionId: string;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface SheetRootProps {
	children?: JSX.Element;
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

export type SheetTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface SheetPortalProps {
	children?: JSX.Element;
	container?: HTMLElement;
}

export type SheetOverlayProps = JSX.HTMLAttributes<HTMLDivElement>;

export type SheetContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export type SheetHandleProps = JSX.HTMLAttributes<HTMLDivElement>;

export type SheetTitleProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export type SheetDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export type SheetCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
