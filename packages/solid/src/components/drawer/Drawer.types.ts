import type { JSX } from 'solid-js';

export interface DrawerRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
}

export interface DrawerPortalProps {
	children?: JSX.Element;
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
