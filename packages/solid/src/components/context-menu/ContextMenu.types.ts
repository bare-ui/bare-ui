import type { JSX } from 'solid-js';

export interface ContextMenuRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (right-click to open, outside click or Escape to close). */
	onOpenChange?: (open: boolean) => void;
	/** Disable the context menu so right-click falls back to the native menu. */
	disabled?: boolean;
}

export type ContextMenuTriggerProps = JSX.HTMLAttributes<HTMLDivElement>;

export type ContextMenuContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface ContextMenuItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Disable this menu item. */
	disabled?: boolean;
	/** Called when the item is selected (and closes the menu). */
	onSelect?: () => void;
}

export type ContextMenuSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface ContextMenuContextValue {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly position: { x: number; y: number };
	openAt: (x: number, y: number) => void;
	close: () => void;
	setContentEl: (el: HTMLDivElement | null) => void;
	getContentEl: () => HTMLDivElement | null;
}
