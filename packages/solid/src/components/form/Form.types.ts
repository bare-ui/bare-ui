import type { JSX } from 'solid-js';

export type FormRootProps = JSX.FormHTMLAttributes<HTMLFormElement>;

export interface FormFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Optional name (used as id prefix and on the `name` attr if Control wraps a native field). */
	name?: string;
	/** Marks the whole field as invalid; toggles aria-invalid + data-invalid on the control. */
	invalid?: boolean;
	/** Marks the field as required (toggles aria-required + data-required). */
	required?: boolean;
	/** Marks the field as disabled (toggles disabled + data-disabled on the control). */
	disabled?: boolean;
}

export interface FormLabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
	/** When true, mutate the child element's attributes instead of rendering a <label>. */
	asChild?: boolean;
}

export interface FormControlProps {
	/** A single form control (input, select, textarea, etc). The Field's id, aria-* and disabled props will be merged in. */
	children: JSX.Element;
}

export type FormDescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface FormErrorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** When true, render even if the surrounding Field is not invalid. */
	forceMount?: boolean;
}

export interface FormFieldContextValue {
	readonly id: string;
	readonly descriptionId: string;
	readonly errorId: string;
	readonly name?: string;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly disabled: boolean;
	readonly hasDescription: boolean;
	readonly hasError: boolean;
	registerDescription: (present: boolean) => void;
	registerError: (present: boolean) => void;
}
