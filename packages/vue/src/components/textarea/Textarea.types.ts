export interface TextareaRootProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	invalidType?: string;
	errorMessage?: Record<string, string>;
	isRequired?: boolean;
	isSuccess?: boolean;
	id?: string;
	class?: string;
}

export interface TextareaFieldProps {
	class?: string;
}

export interface TextareaLabelProps {
	class?: string;
}

export interface TextareaErrorProps {
	class?: string;
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
