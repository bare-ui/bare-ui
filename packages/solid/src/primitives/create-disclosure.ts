import { createSignal, mergeProps, type Accessor } from 'solid-js';

export interface CreateDisclosureOptions {
	/** Initial open state */
	defaultOpen?: boolean;
	/** Called whenever the open state changes */
	onOpenChange?: (open: boolean) => void;
}

export interface CreateDisclosureResult {
	/** Reactive accessor for the current open state */
	isOpen: Accessor<boolean>;
	open: () => void;
	close: () => void;
	toggle: () => void;
	setOpen: (value: boolean) => void;
}

/**
 * Manages a boolean open/close state with stable open/close/toggle handlers.
 *
 * Use this for modals, drawers, dropdowns, accordions — anything with a binary
 * open state that doesn't need to be controlled from the outside.
 *
 * @example
 * const { isOpen, open, close, toggle } = createDisclosure({ defaultOpen: false })
 */
export function createDisclosure(options: CreateDisclosureOptions = {}): CreateDisclosureResult {
	const merged = mergeProps({ defaultOpen: false }, options);
	const [isOpen, setIsOpen] = createSignal(merged.defaultOpen);

	const setOpen = (value: boolean) => {
		setIsOpen(value);
		merged.onOpenChange?.(value);
	};

	return {
		isOpen,
		open: () => setOpen(true),
		close: () => setOpen(false),
		toggle: () => setOpen(!isOpen()),
		setOpen,
	};
}
