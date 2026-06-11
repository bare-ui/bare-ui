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
	triggerId: string;
	contentId: string;
}

// ---------------------------------------------------------------------------
// Root — discriminated union for single vs multiple
// ---------------------------------------------------------------------------

interface AccordionRootBase {
	/** Disables all items */
	disabled?: boolean;
	class?: string;
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

export interface AccordionItemProps {
	/** Unique identifier — must match the value used in Root */
	value: string;
	/** Disables this item only */
	disabled?: boolean;
	class?: string;
}

export interface AccordionTriggerProps {
	class?: string;
}

export interface AccordionContentProps {
	/** Keep content mounted in the DOM even when closed */
	forceMount?: boolean;
	class?: string;
}
