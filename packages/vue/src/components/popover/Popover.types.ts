export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverRootProps {
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
	class?: string;
}

export interface PopoverTriggerProps {
	class?: string;
}

export interface PopoverContentProps {
	/** Side of the trigger to anchor to. */
	side?: PopoverSide;
	/** Alignment along the side. */
	align?: PopoverAlign;
	/** When true, keep mounted in DOM and toggle visibility via data-state. */
	forceMount?: boolean;
	class?: string;
}

export interface PopoverCloseProps {
	class?: string;
}

export interface PopoverContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerId: string;
	contentId: string;
}
