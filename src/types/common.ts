/**
 * Common Types
 *
 * Shared, generic type definitions used across multiple components.
 */

// ─── Size ────────────────────────────────────────────────────────────────────

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

// ─── Status ──────────────────────────────────────────────────────────────────

export type Status = 'success' | 'warning' | 'danger';

// ─── Position ────────────────────────────────────────────────────────────────

export type HorizontalPosition = 'left' | 'right' | 'center';

// ─── Validation ──────────────────────────────────────────────────────────────

export type ValidationType = '' | 'email' | 'name' | 'phone';

// ─── Form Field ──────────────────────────────────────────────────────────────

export interface BaseFormFieldProps {
	errorMessage?: Record<string, string>;
	isRequired?: boolean;
	label?: string | null;
}

export interface BaseTextFieldProps extends BaseFormFieldProps {
	isSuccess?: boolean;
	value?: string;
	validation?: ValidationType;
	invalidType?: string;
	onChange?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	onErrorChange?: (hasError: boolean) => void;
	onInvalidTypeChange?: (type: string) => void;
}

export interface BaseFormFieldHandle {
	validate: () => void;
}

// ─── Option ──────────────────────────────────────────────────────────────────

export interface BaseOption {
	id: string | number;
	value: string | number;
	label: string;
	disabled?: boolean;
}
