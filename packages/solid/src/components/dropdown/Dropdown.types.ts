import type { JSX } from 'solid-js';
import type { HorizontalPosition } from '@/types/common';

export type DropdownPosition = Extract<HorizontalPosition, 'left' | 'right'>;

export interface DropdownRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (trigger click, outside click, or Escape). */
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
	class?: string;
}

export interface DropdownTriggerProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	children?: JSX.Element;
}

export interface DropdownMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Horizontal alignment of the menu relative to the trigger. */
	position?: DropdownPosition;
	children?: JSX.Element;
	class?: string;
}

export interface DropdownContextValue {
	readonly open: boolean;
	onOpenChange: (open: boolean) => void;
}
