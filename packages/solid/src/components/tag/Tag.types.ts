import type { JSX } from 'solid-js';

export interface TagRootProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Disabled state: removes interaction and applies data-disabled. */
	disabled?: boolean;
}

export type TagLabelProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface TagRemoveProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Accessible label for the remove button. Defaults to "Remove". */
	'aria-label'?: string;
}
