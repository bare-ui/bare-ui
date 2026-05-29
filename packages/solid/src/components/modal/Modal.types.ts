import type { JSX } from 'solid-js';

export interface ModalRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (overlay click, Escape, or a close trigger). */
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
}

export interface ModalPortalProps {
	children?: JSX.Element;
	/** DOM node to render the modal into. Defaults to `document.body`. */
	container?: HTMLElement;
}

export interface ModalOverlayProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onClick'> {
	children?: JSX.Element;
	class?: string;
	onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
}

export interface ModalContentProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onClick'> {
	children?: JSX.Element;
	class?: string;
	onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
}

export type ModalCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ModalContextValue {
	readonly open: boolean;
	onOpenChange: (open: boolean) => void;
}
