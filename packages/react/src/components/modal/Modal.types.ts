export interface ModalRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (overlay click, Escape, or a close trigger). */
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

export interface ModalPortalProps {
	children?: React.ReactNode;
	/** DOM node to render the modal into. Defaults to `document.body`. */
	container?: HTMLElement;
}

export interface ModalOverlayProps {
	children?: React.ReactNode;
	className?: string;
}

export interface ModalContentProps {
	children?: React.ReactNode;
	className?: string;
}

export type ModalCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ModalContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
