import React from 'react';

export interface ContextMenuRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
}

export type ContextMenuTriggerProps = React.HTMLAttributes<HTMLDivElement>;

export type ContextMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

export interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
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
