export interface InputRootProps {
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
	isActive: boolean;
	invalidType: string;
	isSuccess: boolean;
	isRequired: boolean;
	errorMessage: Record<string, string>;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}
