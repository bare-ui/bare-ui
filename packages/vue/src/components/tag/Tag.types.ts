export interface TagRootProps {
	/** Disabled state: removes interaction and applies data-disabled. */
	disabled?: boolean;
}

export type TagLabelProps = Record<string, never>;

export interface TagRemoveProps {
	/** Accessible label for the remove button. Defaults to "Remove". */
	'aria-label'?: string;
}
