export interface DrawerContextValue {
	open: boolean;
	onOpenChange: (value: boolean) => void;
}

export interface DrawerRootProps {
	/** Controlled open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). */
	defaultOpen?: boolean;
	/** Called when the open state changes (overlay click, Escape, or a close trigger). */
	onOpenChange?: (value: boolean) => void;
}

export interface DrawerPortalProps {
	/** DOM node to render the drawer into. Defaults to `document.body`. */
	container?: string | HTMLElement;
}

export interface DrawerOverlayProps { class?: string; }
export interface DrawerContentProps { class?: string; }
export interface DrawerHeaderProps { class?: string; }
export interface DrawerCloseProps { class?: string; }
