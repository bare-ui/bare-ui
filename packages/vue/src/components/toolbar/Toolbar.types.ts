export type ToolbarOrientation = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ToolbarContextValue {
	orientation: ToolbarOrientation;
	isTabbable: (id: string) => boolean;
	register: (id: string, el: HTMLElement) => () => void;
	onItemFocus: (id: string) => void;
	onItemKeyDown: (event: KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ToolbarRootProps {
	/** Layout + arrow-key axis. Default `'horizontal'`. */
	orientation?: ToolbarOrientation;
	/** Wrap focus from last → first and vice versa. Default `true`. */
	loop?: boolean;
	/** class is forwarded via attribute fallthrough — do not declare in defineProps */
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface ToolbarButtonProps {
	class?: string;
	disabled?: boolean;
}

export interface ToolbarLinkProps {
	class?: string;
	href?: string;
}

export interface ToolbarSeparatorProps {
	orientation?: ToolbarOrientation;
	class?: string;
}
