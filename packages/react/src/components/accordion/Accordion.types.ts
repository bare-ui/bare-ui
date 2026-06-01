import React from 'react';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface AccordionContextValue {
	isOpen: (value: string) => boolean;
	toggle: (value: string) => void;
	disabled: boolean;
}

export interface AccordionItemContextValue {
	value: string;
	isOpen: boolean;
	disabled: boolean;
	/** Stable id for the Trigger button — Content references it via aria-labelledby */
	triggerId: string;
	/** Stable id for the Content region — Trigger references it via aria-controls */
	contentId: string;
}

// ---------------------------------------------------------------------------
// Root — discriminated union for single vs multiple
// ---------------------------------------------------------------------------

interface AccordionRootBase extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Disables all items */
	disabled?: boolean;
}

interface AccordionRootSingle extends AccordionRootBase {
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

interface AccordionRootMultiple extends AccordionRootBase {
	type: 'multiple';
	/** Controlled open values */
	value?: string[];
	/** Initial open values (uncontrolled) */
	defaultValue?: string[];
	/** Called when open items change */
	onChange?: (value: string[]) => void;
}

export type AccordionRootProps = AccordionRootSingle | AccordionRootMultiple;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Unique identifier — must match the value used in Root */
	value: string;
	/** Disables this item only */
	disabled?: boolean;
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Keep content mounted in the DOM even when closed (useful for CSS animations) */
	forceMount?: boolean;
}
