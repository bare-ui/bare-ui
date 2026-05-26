import type { JSX } from 'solid-js';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export type PopoverTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface PopoverContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Side of the trigger to anchor to. */
	side?: PopoverSide;
	/** Alignment along the side. */
	align?: PopoverAlign;
	/** When true, keep mounted in DOM and toggle visibility via data-state. */
	forceMount?: boolean;
}

export type PopoverCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface PopoverContextValue {
	readonly open: boolean;
	setOpen: (open: boolean) => void;
	readonly triggerId: string;
	readonly contentId: string;
}
