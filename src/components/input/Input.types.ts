import type { ValidationType } from '@/types/common';

export interface InputRootProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	onErrorChange?: (hasError: boolean) => void;
	onInvalidTypeChange?: (type: string) => void;
	validation?: ValidationType;
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
	validation: ValidationType;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
	fieldRef: React.RefObject<HTMLInputElement | null>;
	setFieldNode: (node: HTMLInputElement | null) => void;
}

export interface InputHandle {
	validate: () => void;
}
