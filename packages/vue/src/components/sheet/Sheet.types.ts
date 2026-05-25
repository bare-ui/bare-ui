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
	titleId: string;
	descriptionId: string;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface SheetRootProps {
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
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface SheetTriggerProps {
	class?: string;
}

export interface SheetPortalProps {
	container?: string | HTMLElement;
}

export interface SheetOverlayProps {
	class?: string;
}

export interface SheetContentProps {
	class?: string;
}

export interface SheetHandleProps {
	class?: string;
}

export interface SheetTitleProps {
	class?: string;
}

export interface SheetDescriptionProps {
	class?: string;
}

export interface SheetCloseProps {
	class?: string;
}
