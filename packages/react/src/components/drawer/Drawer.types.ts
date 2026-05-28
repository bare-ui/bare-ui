export interface DrawerRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (overlay click, Escape, or a close trigger). */
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

export interface DrawerPortalProps {
	children?: React.ReactNode;
	/** DOM node to render the drawer into. Defaults to `document.body`. */
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
