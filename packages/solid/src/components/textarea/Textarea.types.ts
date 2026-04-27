import type { JSX } from 'solid-js';

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
