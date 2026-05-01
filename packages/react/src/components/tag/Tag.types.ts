import React from 'react';

export interface TagRootProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** Disabled state: removes interaction and applies data-disabled. */
	disabled?: boolean;
}

export type TagLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export interface TagRemoveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Accessible label for the remove button. Defaults to "Remove". */
	'aria-label'?: string;
}
