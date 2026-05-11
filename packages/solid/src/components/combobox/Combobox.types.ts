import type { JSX } from 'solid-js';

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

export interface ComboboxRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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

export type ComboboxInputProps = Omit<
	JSX.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'defaultValue' | 'onChange' | 'role' | 'aria-controls' | 'aria-activedescendant'
>;

export type ComboboxTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type ComboboxContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export type ComboboxEmptyProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface ComboboxItemRenderProps {
	option: ComboboxOption;
	highlighted: boolean;
	selected: boolean;
}

export interface ComboboxItemsProps {
	children: (props: ComboboxItemRenderProps) => JSX.Element;
}

export interface ComboboxContextValue {
	readonly options: ComboboxOption[];
	readonly filtered: ComboboxOption[];
	readonly selected: string | null;
	readonly inputValue: string;
	readonly open: boolean;
	readonly highlightedIndex: number;
	readonly disabled: boolean;
	readonly listboxId: string;
	getOptionId: (value: string) => string;
	setOpen: (open: boolean) => void;
	setInputValue: (text: string) => void;
	commitOption: (option: ComboboxOption) => void;
	setHighlightedIndex: (index: number) => void;
	moveHighlight: (delta: number) => void;
}
