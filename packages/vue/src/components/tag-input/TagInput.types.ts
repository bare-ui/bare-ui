export interface TagInputRootProps {
	/** Controlled list of tags. */
	value?: string[];
	/** Initial list (uncontrolled). */
	defaultValue?: string[];
	/** Called when tags are added or removed. */
	onChange?: (value: string[]) => void;
	/** Disable input + remove buttons. */
	disabled?: boolean;
	/** Maximum number of tags. */
	maxTags?: number;
	/** Allow duplicate values (case-sensitive). Defaults to false. */
	allowDuplicates?: boolean;
	/** Characters that commit the current input as a tag. Defaults to ['Enter', ',']. */
	commitKeys?: string[];
	/** Optional validator — return false to reject the tag. */
	validate?: (tag: string, current: string[]) => boolean;
}

export type TagInputListProps = Record<string, never>;

export interface TagInputTagProps {
	/** The tag's text — used for the remove button's accessible name. */
	label: string;
	/** Remove this tag (wire to the `remove` argument from `TagInput.Items`). */
	onRemove: () => void;
	/** Override the remove button's accessible name. Defaults to `Remove {label}`. */
	removeLabel?: string;
	/** Content of the remove button (defaults to "×"). */
	removeContent?: string;
	/** Class applied to the built-in remove button. */
	removeClassName?: string;
}

export interface TagInputFieldProps {
	placeholder?: string;
}

export interface TagInputContextValue {
	tags: { value: string[] };
	disabled: { value: boolean };
	maxTags: { value: number | undefined };
	commitKeys: { value: string[] };
	addTag: (raw: string) => boolean;
	removeTag: (index: number) => void;
}
