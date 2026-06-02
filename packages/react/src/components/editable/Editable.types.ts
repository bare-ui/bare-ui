import React from 'react';

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
	/**
	 * Set true by a keyboard submit/cancel so Preview restores focus to itself when
	 * it remounts. Blur-submit leaves it false (focus already moved on purpose).
	 */
	returnFocusRef: React.MutableRefObject<boolean>;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface EditableRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit'> {
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

export type EditablePreviewProps = React.HTMLAttributes<HTMLSpanElement>;

export type EditableInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange' | 'defaultValue'
>;

export type EditableAreaProps = Omit<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	'value' | 'onChange' | 'defaultValue'
>;

export type EditableEditTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type EditableSubmitTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type EditableCancelTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
