import React from 'react';

export interface TagInputRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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

export type TagInputListProps = React.HTMLAttributes<HTMLDivElement>;

export type TagInputFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'defaultValue' | 'onChange'
>;

export interface TagInputContextValue {
	tags: string[];
	disabled: boolean;
	maxTags?: number;
	addTag: (raw: string) => boolean;
	removeTag: (index: number) => void;
	commitKeys: string[];
}
