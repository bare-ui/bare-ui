export interface PasswordContextValue {
	inputId: string;
	value: string;
	visible: boolean;
	isRequired: boolean;
	invalidType: string;
	errorMessage: Record<string, string>;
	setVisible: (v: boolean) => void;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}

export interface PasswordRootProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	isRequired?: boolean;
	errorMessage?: Record<string, string>;
	invalidType?: string;
	id?: string;
	class?: string;
}

export interface PasswordFieldProps {
	class?: string;
}

export interface PasswordToggleProps {
	class?: string;
}

export interface PasswordLabelProps {
	class?: string;
}

export interface PasswordErrorProps {
	class?: string;
}
