import React from 'react';

export type ToolbarOrientation = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ToolbarContextValue {
	orientation: ToolbarOrientation;
	isTabbable: (id: string) => boolean;
	register: (id: string, el: HTMLElement) => () => void;
	onItemFocus: (id: string) => void;
	onItemKeyDown: (event: React.KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ToolbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Layout + arrow-key axis. Default `'horizontal'`. */
	orientation?: ToolbarOrientation;
	/** Wrap focus from last → first and vice versa. Default `true`. */
	loop?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type ToolbarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ToolbarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Controlled pressed state. */
	pressed?: boolean;
	/** Initial pressed state (uncontrolled). Default `false`. */
	defaultPressed?: boolean;
	/** Called when the pressed state changes. */
	onPressedChange?: (pressed: boolean) => void;
}

export type ToolbarLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface ToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: ToolbarOrientation;
}
