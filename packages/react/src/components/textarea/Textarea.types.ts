export interface TextareaRootProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	/** Set by the consumer to show an error state. Use the key in errorMessage to display the message. */
	invalidType?: string;
	errorMessage?: Record<string, string>;
	isRequired?: boolean;
	isSuccess?: boolean;
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
