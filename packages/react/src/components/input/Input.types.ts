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
	children?: React.ReactNode;
	className?: string;
}

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'defaultValue'>;

export interface InputLabelProps {
	children?: React.ReactNode;
	className?: string;
}

export interface InputErrorProps {
	children?: React.ReactNode;
	className?: string;
}

export interface InputContextValue {
	value: string;
	inputId: string;
	errorId: string;
	isActive: boolean;
	invalidType: string;
	isSuccess: boolean;
	isRequired: boolean;
	errorMessage: Record<string, string>;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}
