export type CommandFilter = (value: string, search: string, keywords: string[]) => boolean;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface CommandRegistryEntry {
	keywords: string[];
	disabled: boolean;
	groupId?: string;
	onSelect?: (value: string) => void;
}

export interface CommandContextValue {
	query: string;
	setQuery: (value: string) => void;
	searching: boolean;
	visible: string[];
	activeValue: string | null;
	setActiveValue: (value: string) => void;
	moveActive: (delta: number) => void;
	registerItem: (value: string, entry: CommandRegistryEntry) => () => void;
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

export interface CommandRootProps {
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
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface CommandInputProps {
	class?: string;
}

export interface CommandListProps {
	class?: string;
}

export interface CommandGroupProps {
	/** Optional heading rendered above the group's items. */
	heading?: string;
	class?: string;
}

export interface CommandItemProps {
	/** Unique value — used as the item's identity and default search text. */
	value: string;
	/** Extra terms to match against. */
	keywords?: string[];
	disabled?: boolean;
	/** Called when this item is chosen. */
	onSelect?: (value: string) => void;
	class?: string;
}

export interface CommandSeparatorProps {
	class?: string;
}

export interface CommandEmptyProps {
	class?: string;
}
