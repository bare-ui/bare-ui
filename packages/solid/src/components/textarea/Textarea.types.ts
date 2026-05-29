import type { JSX } from 'solid-js';

export interface TextareaRootProps {
	/** Controlled textarea value. */
	value?: string;
	/** Initial textarea value (uncontrolled). */
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
	/** Id applied to the textarea; auto-generated when omitted. */
	id?: string;
	children?: JSX.Element;
	class?: string;
}

export interface TextareaFieldProps
	extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
	class?: string;
}

export interface TextareaLabelProps {
	children?: JSX.Element;
	class?: string;
}

export interface TextareaErrorProps {
	children?: JSX.Element;
	class?: string;
}

export interface TextareaContextValue {
	readonly value: string;
	readonly textareaId: string;
	readonly isActive: boolean;
	readonly invalidType: string;
	readonly isSuccess: boolean;
	readonly isRequired: boolean;
	readonly errorMessage: Record<string, string>;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}
