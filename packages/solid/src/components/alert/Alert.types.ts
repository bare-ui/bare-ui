import type { JSX } from 'solid-js';

/**
 * Alert Component Types
 */

export type AlertContextValue = {
	readonly status?: string;
	dismiss: () => void;
};

/** Props for Alert.Root — the container. */
export interface AlertRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
export type AlertTitleProps = JSX.HTMLAttributes<HTMLParagraphElement>;

/** Props for Alert.Description */
export type AlertDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

/** Props for Alert.Dismiss — the close button */
export type AlertDismissProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
