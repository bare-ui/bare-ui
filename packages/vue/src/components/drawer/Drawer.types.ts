export interface DrawerContextValue {
	open: boolean;
	onOpenChange: (value: boolean) => void;
}

export interface DrawerRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (value: boolean) => void;
}

export interface DrawerPortalProps {
	container?: string | HTMLElement;
}

export interface DrawerOverlayProps { class?: string; }
export interface DrawerContentProps { class?: string; }
export interface DrawerHeaderProps { class?: string; }
export interface DrawerCloseProps { class?: string; }
