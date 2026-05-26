import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Option
// ---------------------------------------------------------------------------

export interface MentionOption {
	id: string | number;
	/** Display text — also what gets inserted after the trigger by default. */
	label: string;
	/** Optional value inserted instead of `label`. */
	value?: string;
	disabled?: boolean;
}

export interface MentionItemRenderProps {
	option: MentionOption;
	active: boolean;
	index: number;
}

export interface MentionCoords {
	top: number;
	left: number;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface MentionContextValue {
	text: string;
	options: MentionOption[];
	filtered: MentionOption[];
	open: boolean;
	query: string;
	activeIndex: number;
	disabled: boolean;
	coords: MentionCoords;
	listboxId: string;
	getOptionId: (index: number) => string;
	setInputRef: (el: HTMLTextAreaElement) => void;
	getInputEl: () => HTMLTextAreaElement | undefined;
	setActiveIndex: (index: number) => void;
	moveActive: (delta: number) => void;
	select: (option: MentionOption) => void;
	close: () => void;
	/** Close and suppress re-opening for the current token (Escape). */
	dismiss: () => void;
	handleChange: (value: string, caret: number) => void;
	handleCaret: (caret: number) => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface MentionRootProps
	extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
	/** Options shown when the trigger is active. */
	options: MentionOption[];
	/** Controlled text value. */
	value?: string;
	/** Initial text value (uncontrolled). */
	defaultValue?: string;
	/** Called whenever the text changes. */
	onChange?: (value: string) => void;
	/** Character that opens the menu. Default `'@'`. */
	trigger?: string;
	/** Predicate used to filter options against the current query. */
	filter?: (option: MentionOption, query: string) => boolean;
	/** Called when an option is chosen. */
	onSelect?: (option: MentionOption) => void;
	/** Append a space after the inserted mention. Default `true`. */
	appendSpace?: boolean;
	/** Disable the whole control. */
	disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type MentionInputProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type MentionContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface MentionItemsProps {
	children: (props: MentionItemRenderProps) => JSX.Element;
}

export type MentionEmptyProps = JSX.HTMLAttributes<HTMLDivElement>;
