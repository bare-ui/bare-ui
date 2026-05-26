import type { JSX } from 'solid-js';

export type HoverCardSide = 'top' | 'right' | 'bottom' | 'left';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface HoverCardContextValue {
	readonly open: boolean;
	scheduleOpen: () => void;
	scheduleClose: () => void;
	openNow: () => void;
	closeNow: () => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface HoverCardRootProps {
	children?: JSX.Element;
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** ms to wait before opening on hover. Default `300`. */
	openDelay?: number;
	/** ms to wait before closing after leaving. Default `200`. */
	closeDelay?: number;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type HoverCardTriggerProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface HoverCardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Side of the trigger to render on. Default `'bottom'`. */
	side?: HoverCardSide;
	/** Gap in px between trigger and card. Default `8`. */
	sideOffset?: number;
	/** Keep the card mounted while closed (for CSS exit animations). */
	forceMount?: boolean;
}
