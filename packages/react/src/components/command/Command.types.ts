import React from 'react';

export type CommandFilter = (value: string, search: string, keywords: string[]) => boolean;

interface RegisteredItem {
	keywords: string[];
	disabled: boolean;
	groupId?: string;
	onSelectRef: React.MutableRefObject<((value: string) => void) | undefined>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface CommandContextValue {
	query: string;
	setQuery: (value: string) => void;
	searching: boolean;
	visible: string[];
	activeValue: string | null;
	setActiveValue: (value: string) => void;
	moveActive: (delta: number) => void;
	registerItem: (value: string, item: RegisteredItem) => () => void;
	selectItem: (value: string) => void;
	isVisible: (value: string) => boolean;
	isActive: (value: string) => boolean;
	groupHasVisible: (groupId: string) => boolean;
	listboxId: string;
	getItemId: (value: string) => string;
	close: () => void;
}

export interface CommandGroupContextValue {
	groupId: string;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface CommandRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
	/** Controlled search query. */
	searchValue?: string;
	/** Initial search query (uncontrolled). */
	defaultSearchValue?: string;
	/** Called when the query changes. */
	onSearchChange?: (value: string) => void;
	/** Custom matcher. Defaults to a case-insensitive substring search. */
	filter?: CommandFilter;
	/** Called when any item is selected, with its value. */
	onSelect?: (value: string) => void;
	/** Wrap active-item navigation. Default `true`. */
	loop?: boolean;
	/** Controlled open state (when used as a toggleable palette). */
	open?: boolean;
	/** Initial open state. */
	defaultOpen?: boolean;
	/** Called when the open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** Global hotkey (e.g. `'mod+k'`) that toggles `open`. */
	shortcut?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type CommandInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

export type CommandListProps = React.HTMLAttributes<HTMLDivElement>;

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Optional heading rendered above the group's items. */
	heading?: React.ReactNode;
}

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	/** Unique value — used as the item's identity and default search text. */
	value: string;
	/** Extra terms to match against. */
	keywords?: string[];
	disabled?: boolean;
	/** Called when this item is chosen. */
	onSelect?: (value: string) => void;
}

export type CommandSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export type CommandEmptyProps = React.HTMLAttributes<HTMLDivElement>;
