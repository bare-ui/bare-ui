export type DropdownPosition = 'left' | 'right';

export interface DropdownContextValue {
	open: boolean;
	onOpenChange: (value: boolean) => void;
}

export interface DropdownRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (value: boolean) => void;
	class?: string;
}

export interface DropdownTriggerProps {
	asChild?: boolean;
	class?: string;
}

export interface DropdownMenuProps {
	position?: DropdownPosition;
	class?: string;
}
