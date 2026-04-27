import type { JSX } from 'solid-js';

export interface ModalRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
}

export interface ModalPortalProps {
	children?: JSX.Element;
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
