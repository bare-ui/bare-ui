import type { HorizontalPosition } from '@/types/common';

export type DropdownPosition = Extract<HorizontalPosition, 'left' | 'right'>;

export interface DropdownRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
	className?: string;
}

export interface DropdownTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	children?: React.ReactNode;
	asChild?: boolean;
}

export interface DropdownMenuProps {
	position?: DropdownPosition;
	children?: React.ReactNode;
	className?: string;
}

export interface DropdownContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
