import type { JSX } from 'solid-js';

export interface TagInputRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
	/** Reject duplicate values (case-sensitive). Defaults to true. */
	allowDuplicates?: boolean;
	/** Characters that commit the current input as a tag. Defaults to ['Enter', ',']. */
	commitKeys?: string[];
	/** Optional validator — return false to reject the tag. */
	validate?: (tag: string, current: string[]) => boolean;
}

export type TagInputListProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface TagInputTagProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** The tag's text — used for the remove button's accessible name. */
	label: string;
	/** Remove this tag (wire to the `remove` argument from `TagInput.Items`). */
	onRemove: () => void;
	/** Override the remove button's accessible name. Defaults to `Remove {label}`. */
	removeLabel?: string;
	/** Content of the remove button (defaults to "×"). */
	removeContent?: JSX.Element;
	/** Class applied to the built-in remove button. */
	removeClassName?: string;
}

export type TagInputFieldProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>;

export interface TagInputContextValue {
	readonly tags: string[];
	readonly disabled: boolean;
	readonly maxTags?: number;
	addTag: (raw: string) => boolean;
	removeTag: (index: number) => void;
	readonly commitKeys: string[];
}
