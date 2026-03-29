import React from 'react'

export interface PasswordContextValue {
	inputId: string
	value: string
	visible: boolean
	isRequired: boolean
	invalidType: string
	errorMessage: Record<string, string>
	setVisible: (v: boolean) => void
	handleChange: (value: string) => void
	handleFocus: () => void
	handleBlur: () => void
	setFieldNode: (node: HTMLInputElement | null) => void
}

export interface PasswordRootProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	'onChange' | 'onFocus' | 'onBlur'
> {
	/** Controlled value */
	value?: string
	/** Initial value (uncontrolled) */
	defaultValue?: string
	/** Called on every change */
	onChange?: (value: string) => void
	/** Called when the field gains focus */
	onFocus?: () => void
	/** Called when the field loses focus */
	onBlur?: () => void
	/** Called with true/false when error state changes */
	onErrorChange?: (hasError: boolean) => void
	/** Mark as required — validates on blur */
	isRequired?: boolean
	/** Error messages keyed by type */
	errorMessage?: Record<string, string>
	/** Override the error type externally */
	invalidType?: string
	/** HTML id forwarded to the input */
	id?: string
}

export type PasswordFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'onChange'
>

export type PasswordToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type PasswordLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export type PasswordErrorProps = React.HTMLAttributes<HTMLElement>

export interface PasswordHandle {
	validate: () => void
}
