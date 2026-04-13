/**
 * Alert Component Types
 */

export interface AlertContextValue {
	status?: string;
	dismiss: () => void;
}

export interface AlertRootProps {
	/** Status data attribute for styling */
	status?: string;
	/** Auto-dismiss after timeout */
	isAutoDismissable?: boolean;
	/** Milliseconds before auto-dismiss (default: 3000) */
	dismissCountdown?: number;
	/** Fired when the alert is dismissed */
	onDismiss?: () => void;
	class?: string;
}

export interface AlertTitleProps {
	class?: string;
}

export interface AlertDescriptionProps {
	class?: string;
}

export interface AlertDismissProps {
	class?: string;
}
