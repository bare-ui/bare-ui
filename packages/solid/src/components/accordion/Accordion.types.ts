import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface AccordionContextValue {
	isOpen: (value: string) => boolean;
	toggle: (value: string) => void;
	readonly disabled: boolean;
}

export interface AccordionItemContextValue {
	value: string;
	readonly isOpen: boolean;
	readonly disabled: boolean;
}

// ---------------------------------------------------------------------------
// Root — discriminated union for single vs multiple
// ---------------------------------------------------------------------------

interface AccordionRootBase extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Disables all items */
	disabled?: boolean;
}

export interface AccordionRootSingleProps extends AccordionRootBase {
	type: 'single';
	/** Controlled open value */
	value?: string;
	/** Initial open value (uncontrolled) */
	defaultValue?: string;
	/** Called when the open item changes */
	onChange?: (value: string) => void;
	/** Allow closing the open item by clicking it again (default: false) */
	collapsible?: boolean;
}

export interface AccordionRootMultipleProps extends AccordionRootBase {
	type: 'multiple';
	/** Controlled open values */
	value?: string[];
	/** Initial open values (uncontrolled) */
	defaultValue?: string[];
	/** Called when open items change */
	onChange?: (value: string[]) => void;
}

export type AccordionRootProps = AccordionRootSingleProps | AccordionRootMultipleProps;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface AccordionItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Unique identifier — must match the value used in Root */
	value: string;
	/** Disables this item only */
	disabled?: boolean;
}

export type AccordionTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface AccordionContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Keep content mounted in the DOM even when closed (useful for CSS animations) */
	forceMount?: boolean;
}
