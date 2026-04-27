import type { JSX } from 'solid-js';

export interface PasswordContextValue {
	readonly inputId: string;
	readonly value: string;
	readonly visible: boolean;
	readonly isRequired: boolean;
	readonly invalidType: string;
	readonly errorMessage: Record<string, string>;
	setVisible: (v: boolean) => void;
	handleChange: (value: string) => void;
	handleFocus: () => void;
	handleBlur: () => void;
}

export interface PasswordRootProps
	extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onFocus' | 'onBlur'> {
	/** Controlled value */
	value?: string;
	/** Initial value (uncontrolled) */
	defaultValue?: string;
	/** Called on every change */
	onChange?: (value: string) => void;
	/** Called when the field gains focus */
	onFocus?: () => void;
	/** Called when the field loses focus */
	onBlur?: () => void;
	/** Mark as required — shows * in label and sets required attribute */
	isRequired?: boolean;
	/** Error messages keyed by type, displayed by Password.Error */
	errorMessage?: Record<string, string>;
	/** Set by the consumer to show an error state */
	invalidType?: string;
	/** HTML id forwarded to the input */
	id?: string;
}

export type PasswordFieldProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>;

export type PasswordToggleProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type PasswordLabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement>;

export type PasswordErrorProps = JSX.HTMLAttributes<HTMLElement>;
