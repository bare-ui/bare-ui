import type { ComputedRef, Ref } from 'vue'

export interface ComboboxOption {
	/** Stable identifier (compared with `===`). */
	value: string;
	/** Human-readable label shown in the input when selected. */
	label: string;
	/** Optional subtitle shown in the listbox row. */
	subtitle?: string;
	/** Disable selection of this option. */
	disabled?: boolean;
}

export interface ComboboxRootProps {
	/** Available options. */
	options: ComboboxOption[];
	/** Controlled selected value. Use `null` for empty. */
	value?: string | null;
	/** Initial selected value (uncontrolled). */
	defaultValue?: string | null;
	/** Called when the selection changes. */
	onChange?: (value: string | null, option: ComboboxOption | null) => void;
	/** Controlled input text. */
	inputValue?: string;
	/** Initial input text (uncontrolled). */
	defaultInputValue?: string;
	/** Called when the user types. */
	onInputChange?: (value: string) => void;
	/** Custom filter. Default: case-insensitive label match. */
	filter?: (option: ComboboxOption, inputValue: string) => boolean;
	/** Disable the entire combobox. */
	disabled?: boolean;
	/** Called when the open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state. */
	defaultOpen?: boolean;
}

export type ComboboxInputProps = Record<string, never>;
export type ComboboxTriggerProps = Record<string, never>;
export type ComboboxContentProps = Record<string, never>;
export type ComboboxEmptyProps = Record<string, never>;

export interface ComboboxItemRenderProps {
	option: ComboboxOption;
	highlighted: boolean;
	selected: boolean;
}

export type ComboboxItemsProps = Record<string, never>;

export interface ComboboxContextValue {
	options: ComputedRef<ComboboxOption[]>;
	filtered: ComputedRef<ComboboxOption[]>;
	selected: ComputedRef<string | null>;
	inputValue: ComputedRef<string>;
	open: ComputedRef<boolean>;
	highlightedIndex: Ref<number>;
	disabled: ComputedRef<boolean>;
	listboxId: string;
	getOptionId: (value: string) => string;
	setOpen: (open: boolean) => void;
	setInputValue: (text: string) => void;
	commitOption: (option: ComboboxOption) => void;
	setHighlightedIndex: (index: number) => void;
	moveHighlight: (delta: number) => void;
	registerInputFocus: (focused: boolean) => void;
}
