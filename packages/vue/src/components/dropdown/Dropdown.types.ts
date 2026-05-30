export type DropdownPosition = 'left' | 'right';

export interface DropdownContextValue {
	open: boolean;
	onOpenChange: (value: boolean) => void;
}

export interface DropdownRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (trigger click, outside click, or Escape). */
	onOpenChange?: (value: boolean) => void;
	class?: string;
}

export interface DropdownTriggerProps {
	/** Render the trigger onto the child element instead of a `<button>`, merging props. */
	asChild?: boolean;
	class?: string;
}

export interface DropdownMenuProps {
	/** Horizontal alignment of the menu relative to the trigger. */
	position?: DropdownPosition;
	class?: string;
}
