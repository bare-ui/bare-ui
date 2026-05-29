import type { JSX } from 'solid-js';

export interface SearchOption {
	id: number | string;
	title: string;
	subtitle?: string;
}

export interface SearchRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
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
	children?: JSX.Element;
	class?: string;
}

export interface SearchInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	class?: string;
}

export interface SearchContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	children?: JSX.Element;
	class?: string;
}

export interface SearchItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onClick'> {
	/** The option this result row represents. */
	option: SearchOption;
	/** Optional click handler — item click already calls onSelect internally */
	onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
}

export interface SearchEmptyProps extends JSX.HTMLAttributes<HTMLDivElement> {
	children?: JSX.Element;
	class?: string;
}

export interface SearchContextValue {
	readonly open: boolean;
	onOpenChange: (open: boolean) => void;
	readonly searchValue: string;
	onSearchChange: (value: string) => void;
	onSelect: (option: SearchOption) => void;
	readonly loading: boolean;
	readonly highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
	readonly itemCount: number;
	registerItem: () => number;
	unregisterItem: () => void;
	getInputNode: () => HTMLInputElement | null;
	setInputNode: (node: HTMLInputElement | null) => void;
}
