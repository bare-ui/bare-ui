export interface ModalContextValue {
	open: boolean;
	onOpenChange: (value: boolean) => void;
}

export interface ModalRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (value: boolean) => void;
}

export interface ModalPortalProps {
	container?: string | HTMLElement;
}

export interface ModalOverlayProps { class?: string; }
export interface ModalContentProps { class?: string; }
export interface ModalCloseProps { class?: string; }
