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

// ─── Form Field ──────────────────────────────────────────────────────────────

export interface BaseFormFieldProps {
	errorMessage?: Record<string, string>;
	isRequired?: boolean;
	label?: string | null;
}

// ─── Option ──────────────────────────────────────────────────────────────────

export interface BaseOption {
	id: string | number;
	value: string | number;
	label: string;
	disabled?: boolean;
}
