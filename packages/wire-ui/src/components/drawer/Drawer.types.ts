export interface DrawerRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

export interface DrawerPortalProps {
	children?: React.ReactNode;
	container?: HTMLElement;
}

export interface DrawerOverlayProps {
	children?: React.ReactNode;
	className?: string;
}

export interface DrawerContentProps {
	children?: React.ReactNode;
	className?: string;
}

export interface DrawerHeaderProps {
	children?: React.ReactNode;
	className?: string;
}

export type DrawerCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface DrawerContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
