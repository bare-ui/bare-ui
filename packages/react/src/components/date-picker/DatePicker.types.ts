import React from 'react';

export interface DatePickerRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	value?: Date | null;
	defaultValue?: Date | null;
	onChange?: (date: Date | null) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	closeOnSelect?: boolean;
	/** Locale for the formatted display value. */
	locale?: string;
	/** Format options for the displayed date. */
	formatOptions?: Intl.DateTimeFormatOptions;
}

export type DatePickerTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface DatePickerValueProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
	placeholder?: React.ReactNode;
	children?: (date: Date | null, formatted: string) => React.ReactNode;
}

export type DatePickerContentProps = React.HTMLAttributes<HTMLDivElement>;

export interface DatePickerContextValue {
	value: Date | null;
	open: boolean;
	disabled: boolean;
	closeOnSelect: boolean;
	locale: string;
	formatOptions: Intl.DateTimeFormatOptions;
	setOpen: (open: boolean) => void;
	setValue: (date: Date | null) => void;
	triggerId: string;
	contentId: string;
}
