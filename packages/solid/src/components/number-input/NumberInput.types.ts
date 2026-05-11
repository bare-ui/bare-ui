import type { JSX } from 'solid-js';

export interface NumberInputRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
}

export type NumberInputFieldProps = Omit<
	JSX.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'defaultValue' | 'onChange' | 'type'
>;

export type NumberInputIncrementProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type NumberInputDecrementProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface NumberInputContextValue {
	readonly value: number | null;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly precision: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	setValue: (value: number | null) => void;
	increment: () => void;
	decrement: () => void;
	stepBy: (delta: number) => void;
}
