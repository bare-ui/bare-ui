import type { JSX } from 'solid-js';

export interface SearchOption {
	id: number | string;
	title: string;
	subtitle?: string;
}

export interface SearchRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
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
