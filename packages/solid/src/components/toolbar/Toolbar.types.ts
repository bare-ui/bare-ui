import type { JSX } from 'solid-js';

export type ToolbarOrientation = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ToolbarContextValue {
	readonly orientation: ToolbarOrientation;
	isTabbable: (id: string) => boolean;
	register: (id: string, el: HTMLElement) => () => void;
	onItemFocus: (id: string) => void;
	onItemKeyDown: (event: KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ToolbarRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Layout + arrow-key axis. Default `'horizontal'`. */
	orientation?: ToolbarOrientation;
	/** Wrap focus from last → first and vice versa. Default `true`. */
	loop?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type ToolbarButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type ToolbarLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface ToolbarSeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	orientation?: ToolbarOrientation;
}
