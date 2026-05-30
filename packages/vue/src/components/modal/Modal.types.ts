export interface ModalContextValue {
	open: boolean;
	onOpenChange: (value: boolean) => void;
}

export interface ModalRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (overlay click, Escape, or a close trigger). */
	onOpenChange?: (value: boolean) => void;
}

export interface ModalPortalProps {
	/** DOM node to render the modal into. Defaults to `document.body`. */
	container?: string | HTMLElement;
}

export interface ModalOverlayProps { class?: string; }
export interface ModalContentProps { class?: string; }
export interface ModalCloseProps { class?: string; }
