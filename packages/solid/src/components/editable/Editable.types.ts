import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface EditableContextValue {
	/** Committed value. */
	value: string;
	/** In-progress edit buffer. */
	draft: string;
	isEditing: boolean;
	disabled: boolean;
	placeholder?: string;
	submitOnBlur: boolean;
	setDraft: (value: string) => void;
	startEdit: () => void;
	cancel: () => void;
	submit: () => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface EditableRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit'> {
	/** Controlled committed value. */
	value?: string;
	/** Initial committed value (uncontrolled). */
	defaultValue?: string;
	/** Called when the committed value changes (on submit). */
	onChange?: (value: string) => void;
	/** Controlled editing state. */
	editing?: boolean;
	/** Initial editing state (uncontrolled). */
	defaultEditing?: boolean;
	/** Called when editing starts or stops. */
	onEditingChange?: (editing: boolean) => void;
	/** Called with the new value when an edit is committed. */
	onSubmit?: (value: string) => void;
	/** Called when an edit is discarded. */
	onCancel?: () => void;
	/** Called when editing begins. */
	onEdit?: () => void;
	/** Commit when the field loses focus. Default `true`. */
	submitOnBlur?: boolean;
	/** Prevent editing. */
	disabled?: boolean;
	/** Shown by `Preview` when the value is empty. */
	placeholder?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type EditablePreviewProps = JSX.HTMLAttributes<HTMLSpanElement>;

export type EditableInputProps = Omit<
	JSX.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange' | 'defaultValue'
>;

export type EditableAreaProps = Omit<
	JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
	'value' | 'onChange' | 'defaultValue'
>;

export type EditableEditTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type EditableSubmitTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type EditableCancelTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
