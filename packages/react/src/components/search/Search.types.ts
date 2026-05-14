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
