export interface SearchOption {
	id: number | string;
	title: string;
	subtitle?: string;
}

export interface SearchRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	value?: string;
	defaultSearchValue?: string;
	onSearchChange?: (value: string) => void;
	onSelect?: (option: SearchOption) => void;
	onSubmitSearch?: () => void;
	loading?: boolean;
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
