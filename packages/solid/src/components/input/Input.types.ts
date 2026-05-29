import type { JSX } from 'solid-js';

export interface InputRootProps {
	/** Controlled input value. */
	value?: string;
	/** Initial input value (uncontrolled). */
	defaultValue?: string;
	/** Called with the new value on every change. */
	onChange?: (value: string) => void;
	/** Called when the field gains focus. */
	onFocus?: () => void;
	/** Called when the field loses focus. */
	onBlur?: () => void;
	/** Set by the consumer to show an error state. Use the key in errorMessage to display the message. */
	invalidType?: string;
	/** Map of `invalidType` keys to the error message shown for each. */
	errorMessage?: Record<string, string>;
	/** Mark the field as required. */
	isRequired?: boolean;
	/** Show a success (valid) state. */
	isSuccess?: boolean;
	/** Id applied to the input; auto-generated when omitted. */
	id?: string;
	children?: JSX.Element;
	class?: string;
}

export type InputFieldProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'defaultValue'>;

export interface InputLabelProps {
	children?: JSX.Element;
	class?: string;
}

export interface InputErrorProps {
	children?: JSX.Element;
	class?: string;
}

export interface InputContextValue {
	readonly value: string;
	readonly inputId: string;
	readonly isActive: boolean;
	readonly invalidType: string;
	readonly isSuccess: boolean;
	readonly isRequired: boolean;
	readonly errorMessage: Record<string, string>;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}
