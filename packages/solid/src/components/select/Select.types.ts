import type { JSX } from 'solid-js';

export interface SelectContextValue {
	readonly open: boolean;
	readonly selectedValue: string;
	readonly selectedLabel: string;
	readonly disabled: boolean;
	/** Value of the option the keyboard cursor currently rests on (aria-activedescendant). */
	readonly activeValue: string | null;
	readonly listboxId: string;
	getOptionId: (value: string) => string;
	setOpen: (open: boolean) => void;
	select: (value: string, label: string) => void;
	setActiveValue: (value: string | null) => void;
	moveActive: (delta: number) => void;
	setActiveEdge: (edge: 'first' | 'last') => void;
	selectActive: () => void;
	typeahead: (char: string) => void;
	registerItem: (value: string, label: string, disabled: boolean) => void;
	unregisterItem: (value: string) => void;
}

export interface SelectRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled selected value */
	value?: string;
	/** Initial selected value (uncontrolled) */
	defaultValue?: string;
	/** Called when the selection changes */
	onChange?: (value: string) => void;
	/** Disables the entire select */
	disabled?: boolean;
}

export type SelectTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface SelectValueProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Shown when nothing is selected */
	placeholder?: string;
}

export type SelectContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface SelectItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** The value submitted on selection */
	value: string;
	/** Override the display label (defaults to string children) */
	textValue?: string;
	/** Disables this specific item */
	disabled?: boolean;
}

export type SelectSeparatorProps = JSX.HTMLAttributes<HTMLHRElement>;

export type SelectGroupProps = JSX.HTMLAttributes<HTMLDivElement>;

export type SelectGroupLabelProps = JSX.HTMLAttributes<HTMLSpanElement>;
