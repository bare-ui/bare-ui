import React from 'react';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** Close on outside click. Defaults to true. */
	closeOnOutsideClick?: boolean;
	/** Close on Escape key. Defaults to true. */
	closeOnEscape?: boolean;
}

export interface PopoverTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	children?: React.ReactNode;
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Side of the trigger to anchor to. */
	side?: PopoverSide;
	/** Alignment along the side. */
	align?: PopoverAlign;
	/** When true, keep mounted in DOM and toggle visibility via data-state. */
	forceMount?: boolean;
}

export interface PopoverCloseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	children?: React.ReactNode;
}

export interface PopoverContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerId: string;
	contentId: string;
}
