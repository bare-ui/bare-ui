/**
 * Alert Component Types
 */

export type AlertContextValue = {
	status?: string;
	dismiss: () => void;
};

/** Props for Alert.Root — the container. */
export interface AlertRootProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Status data attribute for styling: 'success' | 'warning' | 'danger' or any string */
	status?: string;
	/** Auto-dismiss after timeout */
	isAutoDismissable?: boolean;
	/** Milliseconds before auto-dismiss (default: 3000) */
	dismissCountdown?: number;
	/** Fired when the alert is dismissed */
	onDismiss?: () => void;
}

/** Props for Alert.Title */
export type AlertTitleProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Props for Alert.Description */
export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Props for Alert.Dismiss — the close button */
export type AlertDismissProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
