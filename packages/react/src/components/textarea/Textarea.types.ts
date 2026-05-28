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
	children?: React.ReactNode;
	className?: string;
}

export interface TextareaFieldProps extends Omit<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	'value' | 'onChange'
> {
	className?: string;
}

export interface TextareaLabelProps {
	children?: React.ReactNode;
	className?: string;
}

export interface TextareaErrorProps {
	children?: React.ReactNode;
	className?: string;
}

export interface TextareaContextValue {
	value: string;
	textareaId: string;
	isActive: boolean;
	invalidType: string;
	isSuccess: boolean;
	isRequired: boolean;
	errorMessage: Record<string, string>;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}
