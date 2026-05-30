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

export interface ToolbarToggleProps {
	class?: string;
	/** Controlled pressed state. */
	pressed?: boolean;
	/** Initial pressed state (uncontrolled). Default `false`. */
	defaultPressed?: boolean;
	/** Disable the toggle — it is skipped by roving focus. */
	disabled?: boolean;
	/** Called when the pressed state changes. */
	onPressedChange?: (pressed: boolean) => void;
}

export interface ToolbarLinkProps {
	class?: string;
	href?: string;
}

export interface ToolbarSeparatorProps {
	orientation?: ToolbarOrientation;
	class?: string;
}
