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
	children?: React.ReactNode;
	className?: string;
}

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	className?: string;
}

export interface SearchContentProps {
	children?: React.ReactNode;
	className?: string;
}

export interface SearchItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
	/** The option this result row represents. */
	option: SearchOption;
	/** Optional click handler — item click already calls onSelect internally */
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface SearchEmptyProps {
	children?: React.ReactNode;
	className?: string;
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
	inputRef: React.RefObject<HTMLInputElement | null>;
}
