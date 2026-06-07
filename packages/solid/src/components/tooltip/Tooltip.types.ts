import type { JSX } from 'solid-js';

export interface TooltipContextValue {
	readonly open: boolean;
	setOpen: (open: boolean) => void;
	/** Stable id for the Content tooltip — Trigger references it via aria-describedby */
	contentId: string;
}

export interface TooltipRootProps {
	/** Controlled open state */
	open?: boolean;
	/** Initial open state (uncontrolled) */
	defaultOpen?: boolean;
	/** Called when open state changes */
	onOpenChange?: (open: boolean) => void;
	/** Delay in ms before showing tooltip on hover */
	delayDuration?: number;
	children?: JSX.Element;
}

export type TooltipTriggerProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface TooltipContentProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Which side to render the tooltip relative to the trigger */
	side?: 'top' | 'bottom' | 'left' | 'right';
}
