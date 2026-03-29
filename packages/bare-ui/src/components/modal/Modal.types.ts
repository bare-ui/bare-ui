export interface ModalRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

export interface ModalPortalProps {
	children?: React.ReactNode;
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
