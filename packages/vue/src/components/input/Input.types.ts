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
	class?: string;
}

export interface InputFieldProps {
	class?: string;
}

export interface InputLabelProps {
	class?: string;
}

export interface InputErrorProps {
	class?: string;
}

export interface InputContextValue {
	value: string;
	inputId: string;
	isActive: boolean;
	invalidType: string;
	isSuccess: boolean;
	isRequired: boolean;
	errorMessage: Record<string, string>;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}
