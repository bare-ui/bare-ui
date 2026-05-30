export interface SearchOption {
	id: number | string;
	title: string;
	subtitle?: string;
}

export interface SearchRootProps {
	/** Controlled open state of the results popover. */
	open?: boolean;
	/** Initial open state of the results popover (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the results popover opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Controlled search input value. */
	value?: string;
	/** Initial search input value (uncontrolled). */
	defaultSearchValue?: string;
	/** Called when the search text changes, debounced by `searchDelay`. */
	onSearchChange?: (value: string) => void;
	/** Called with the option the user chooses from the results. */
	onSelect?: (option: SearchOption) => void;
	/** Called when the user submits the search (Enter with no result highlighted). */
	onSubmitSearch?: () => void;
	/** Show a loading state while results are being fetched. */
	loading?: boolean;
	/** Debounce delay in milliseconds before `onSearchChange` fires. */
	searchDelay?: number;
	class?: string;
}

export interface SearchInputProps {
	class?: string;
}

export interface SearchContentProps {
	class?: string;
}

export interface SearchItemProps {
	/** The option this result row represents. */
	option: SearchOption;
	class?: string;
}

export interface SearchEmptyProps {
	class?: string;
}

export interface SearchContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	searchValue: string;
	onSearchChange: (value: string) => void;
	onSelect: (option: SearchOption) => void;
	loading: boolean;
	highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
	itemCount: number;
	registerItem: () => number;
	unregisterItem: () => void;
	inputRef: HTMLInputElement | null;
	setInputNode: (node: HTMLInputElement | null) => void;
}
