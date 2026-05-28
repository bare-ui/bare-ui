import React from 'react';

export interface ContextMenuRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (right-click to open, outside click or Escape to close). */
	onOpenChange?: (open: boolean) => void;
	/** Disable the context menu so right-click falls back to the native menu. */
	disabled?: boolean;
}

export type ContextMenuTriggerProps = React.HTMLAttributes<HTMLDivElement>;

export type ContextMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

export interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Disable this menu item. */
	disabled?: boolean;
	/** Called when the item is selected (and closes the menu). */
	onSelect?: () => void;
}

export type ContextMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export interface ContextMenuContextValue {
	open: boolean;
	disabled: boolean;
	position: { x: number; y: number };
	openAt: (x: number, y: number) => void;
	close: () => void;
}
