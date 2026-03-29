import React from 'react';

export interface TooltipContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
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
	children?: React.ReactNode;
}

export type TooltipTriggerProps = React.HTMLAttributes<HTMLSpanElement>;

export interface TooltipContentProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** Which side to render the tooltip relative to the trigger */
	side?: 'top' | 'bottom' | 'left' | 'right';
}
