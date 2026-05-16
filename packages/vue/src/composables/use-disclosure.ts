import { ref, type Ref } from 'vue';

export interface UseDisclosureOptions {
	/** Initial open state (uncontrolled) */
	defaultOpen?: boolean;
	/** Called whenever the open state changes */
	onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureResult {
	isOpen: Ref<boolean>;
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
 * const { isOpen, open, close, toggle } = useDisclosure({ defaultOpen: false })
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureResult {
	const { defaultOpen = false, onOpenChange } = options;
	const isOpen = ref(defaultOpen);

	function setOpen(value: boolean) {
		isOpen.value = value;
		onOpenChange?.(value);
	}

	return {
		isOpen,
		open: () => setOpen(true),
		close: () => setOpen(false),
		toggle: () => setOpen(!isOpen.value),
		setOpen,
	};
}
