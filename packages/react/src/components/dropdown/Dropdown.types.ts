import type { HorizontalPosition } from '@/types/common';

export type DropdownPosition = Extract<HorizontalPosition, 'left' | 'right'>;

export interface DropdownRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (trigger click, outside click, or Escape). */
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
	className?: string;
}

export interface DropdownTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	children?: React.ReactNode;
	/** Render the trigger onto the child element instead of a `<button>`, merging props. */
	asChild?: boolean;
}

export interface DropdownMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Horizontal alignment of the menu relative to the trigger. */
	position?: DropdownPosition;
	children?: React.ReactNode;
}

export interface DropdownContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
