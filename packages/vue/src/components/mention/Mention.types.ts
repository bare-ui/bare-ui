import type { ComputedRef, Ref } from 'vue'

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
	text: ComputedRef<string>;
	options: ComputedRef<MentionOption[]>;
	filtered: ComputedRef<MentionOption[]>;
	open: ComputedRef<boolean>;
	query: ComputedRef<string>;
	activeIndex: Ref<number>;
	disabled: ComputedRef<boolean>;
	coords: ComputedRef<MentionCoords>;
	listboxId: string;
	getOptionId: (index: number) => string;
	inputRef: Ref<HTMLTextAreaElement | null>;
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

export interface MentionRootProps {
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
	/** Additional class applied to the root element. */
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface MentionInputProps {
	/** Additional class applied to the textarea. */
	class?: string;
}

export interface MentionContentProps {
	/** Additional class applied to the listbox. */
	class?: string;
}

export type MentionItemsProps = Record<string, never>;

export interface MentionEmptyProps {
	/** Additional class applied to the empty element. */
	class?: string;
}
