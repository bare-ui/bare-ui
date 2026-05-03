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
	setValue: (value: number | null) => void;
	increment: () => void;
	decrement: () => void;
	stepBy: (delta: number) => void;
}
