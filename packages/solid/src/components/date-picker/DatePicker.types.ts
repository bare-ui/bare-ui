import type { JSX } from 'solid-js';

export interface DatePickerRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled selected date (`null` when cleared). */
	value?: Date | null;
	/** Initially selected date (uncontrolled). */
	defaultValue?: Date | null;
	/** Called with the newly selected date, or `null` when cleared. */
	onChange?: (date: Date | null) => void;
	/** Controlled open state of the calendar popover. */
	open?: boolean;
	/** Initial open state of the calendar popover (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the calendar popover opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Disable the trigger and prevent opening the calendar. */
	disabled?: boolean;
	/** Close the popover automatically once a date is selected. */
	closeOnSelect?: boolean;
	/** Locale for the formatted display value. */
	locale?: string;
	/** Format options for the displayed date. */
	formatOptions?: Intl.DateTimeFormatOptions;
}

export type DatePickerTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface DatePickerValueProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
	placeholder?: JSX.Element;
	children?: (date: Date | null, formatted: string) => JSX.Element;
}

export type DatePickerContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface DatePickerContextValue {
	readonly value: Date | null;
	readonly open: boolean;
	readonly disabled: boolean;
	readonly closeOnSelect: boolean;
	readonly locale: string;
	readonly formatOptions: Intl.DateTimeFormatOptions;
	setOpen: (open: boolean) => void;
	setValue: (date: Date | null) => void;
	readonly triggerId: string;
	readonly contentId: string;
}
