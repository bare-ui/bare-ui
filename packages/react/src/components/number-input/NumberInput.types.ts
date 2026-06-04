import React from 'react';

export interface NumberInputRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled value. Use `null` to represent an empty input. */
	value?: number | null;
	/** Initial value (uncontrolled). */
	defaultValue?: number | null;
	/** Called when the value changes. */
	onChange?: (value: number | null) => void;
	/** Minimum allowed value. */
	min?: number;
	/** Maximum allowed value. */
	max?: number;
	/** Increment / decrement step. Defaults to 1. */
	step?: number;
	/** Decimal precision. Defaults to step's decimal count. */
	precision?: number;
	/** Disable input + buttons. */
	disabled?: boolean;
	/** Read-only field (buttons still disabled). */
	readOnly?: boolean;
	/**
	 * BCP 47 locale for number formatting. Falls back to the nearest
	 * `WireUIProvider`, then `en-US`. Only affects display/parsing when
	 * `formatOptions` is also set.
	 */
	locale?: string;
	/**
	 * `Intl.NumberFormat` options. When provided, the committed value is
	 * displayed via `Intl.NumberFormat(locale, formatOptions)` and user input is
	 * parsed using the locale's group/decimal separators. When omitted, the
	 * field shows the raw numeric string (the default, unchanged behavior).
	 */
	formatOptions?: Intl.NumberFormatOptions;
}

export type NumberInputFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'defaultValue' | 'onChange' | 'type'
>;

export type NumberInputIncrementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type NumberInputDecrementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface NumberInputContextValue {
	value: number | null;
	min: number;
	max: number;
	step: number;
	precision: number;
	disabled: boolean;
	readOnly: boolean;
	locale: string;
	formatOptions?: Intl.NumberFormatOptions;
	setValue: (value: number | null) => void;
	increment: () => void;
	decrement: () => void;
	stepBy: (delta: number) => void;
}
