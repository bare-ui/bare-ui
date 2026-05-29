import type { JSX } from 'solid-js';

export interface DrawerRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (overlay click, Escape, or a close trigger). */
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
}

export interface DrawerPortalProps {
	children?: JSX.Element;
	/** DOM node to render the drawer into. Defaults to `document.body`. */
	container?: HTMLElement;
}

export interface DrawerOverlayProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onClick'> {
	children?: JSX.Element;
	class?: string;
	onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
}

export interface DrawerContentProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onClick'> {
	children?: JSX.Element;
	class?: string;
	onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
}

export interface DrawerHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
	children?: JSX.Element;
	class?: string;
}

export type DrawerCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface DrawerContextValue {
	readonly open: boolean;
	onOpenChange: (open: boolean) => void;
}
