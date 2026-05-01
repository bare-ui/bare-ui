import React from 'react';

export type FormRootProps = React.FormHTMLAttributes<HTMLFormElement>;

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Optional name (used as id prefix and on the `name` attr if Control wraps a native field). */
	name?: string;
	/** Marks the whole field as invalid; toggles aria-invalid + data-invalid on the control. */
	invalid?: boolean;
	/** Marks the field as required (toggles aria-required + data-required). */
	required?: boolean;
	/** Marks the field as disabled (toggles disabled + data-disabled on the control). */
	disabled?: boolean;
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	/** When true, render a different element instead of <label>. */
	asChild?: boolean;
}

export interface FormControlProps {
	/** A single form control (input, select, textarea, etc). The Field's id, aria-* and disabled props will be merged in. */
	children: React.ReactElement;
}

export type FormDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
	/** When true, render even if the surrounding Field is not invalid. */
	forceMount?: boolean;
}

export interface FormFieldContextValue {
	id: string;
	descriptionId: string;
	errorId: string;
	name?: string;
	invalid: boolean;
	required: boolean;
	disabled: boolean;
	hasDescription: boolean;
	hasError: boolean;
	registerDescription: (present: boolean) => void;
	registerError: (present: boolean) => void;
}
