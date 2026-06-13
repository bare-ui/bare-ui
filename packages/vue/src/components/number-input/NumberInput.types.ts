import type { Ref, ComputedRef } from 'vue'

export interface NumberInputRootProps {
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

export type NumberInputFieldProps = Record<string, never>;
export type NumberInputIncrementProps = Record<string, never>;
export type NumberInputDecrementProps = Record<string, never>;

export interface NumberInputContextValue {
	value: ComputedRef<number | null> | Ref<number | null>;
	min: ComputedRef<number>;
	max: ComputedRef<number>;
	step: ComputedRef<number>;
	precision: ComputedRef<number>;
	disabled: ComputedRef<boolean>;
	readOnly: ComputedRef<boolean>;
	locale: ComputedRef<string>;
	formatOptions: ComputedRef<Intl.NumberFormatOptions | undefined>;
	setValue: (value: number | null) => void;
	increment: () => void;
	decrement: () => void;
	stepBy: (delta: number) => void;
}
