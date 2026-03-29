import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { mergeProps } from '@/utils/merge-props';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import type {
	AlertContextValue,
	AlertDescriptionProps,
	AlertDismissProps,
	AlertRootProps,
	AlertTitleProps,
} from './Alert.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AlertContext = createContext<AlertContextValue | null>(null);

function useAlertContext(): AlertContextValue {
	const ctx = useContext(AlertContext);
	if (!ctx) {
		throw new globalThis.Error('[bare-ui] Alert sub-components must be used inside <Alert.Root>');
	}
	return ctx;
}

// ---------------------------------------------------------------------------
// Alert.Root
// ---------------------------------------------------------------------------

/**
 * The container for the Alert. Manages dismissal state and exposes:
 * - `data-status` — for styling by status ('success', 'warning', 'danger', etc.)
 * - `data-dismissed` — present when the alert has been dismissed
 *
 * Returns null once dismissed.
 *
 * @example
 * <Alert.Root status="success" isDismissable onDismiss={() => console.log('dismissed')}>
 *   <Alert.Title>Success!</Alert.Title>
 *   <Alert.Description>Your changes were saved.</Alert.Description>
 *   <Alert.Dismiss aria-label="Close" />
 * </Alert.Root>
 */
const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(
	({ status, isAutoDismissable = false, dismissCountdown = 3000, onDismiss, children, ...rest }, ref) => {
		const [dismissed, setDismissed] = useState(false);
		const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

		const dismiss = useCallback(() => {
			setDismissed(true);
			onDismiss?.();
		}, [onDismiss]);

		useEffect(() => {
			if (isAutoDismissable) {
				timeoutRef.current = setTimeout(dismiss, dismissCountdown);
			}
			return () => {
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
			};
		}, [isAutoDismissable, dismissCountdown, dismiss]);

		if (dismissed) return null;

		return (
			<AlertContext.Provider value={{ status, dismiss }}>
				<div
					ref={ref}
					role='alert'
					data-status={status}
					{...rest}>
					{children}
				</div>
			</AlertContext.Provider>
		);
	},
);

AlertRoot.displayName = 'Alert.Root';

// ---------------------------------------------------------------------------
// Alert.Title
// ---------------------------------------------------------------------------

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(({ children, ...rest }, ref) => (
	<p
		ref={ref}
		data-part='title'
		{...rest}>
		{children}
	</p>
));

AlertTitle.displayName = 'Alert.Title';

// ---------------------------------------------------------------------------
// Alert.Description
// ---------------------------------------------------------------------------

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(({ children, ...rest }, ref) => (
	<p
		ref={ref}
		data-part='description'
		{...rest}>
		{children}
	</p>
));

AlertDescription.displayName = 'Alert.Description';

// ---------------------------------------------------------------------------
// Alert.Dismiss
// ---------------------------------------------------------------------------

/**
 * The dismiss button. Fires the Root's dismiss handler when clicked.
 * Tracks hover/focus-visible/active state via data attributes.
 */
const AlertDismiss = React.forwardRef<HTMLButtonElement, AlertDismissProps>(({ children, ...rest }, ref) => {
	const { dismiss } = useAlertContext();
	const { handlers, dataAttributes } = useInteractiveState();

	const mergedProps = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

	return (
		<button
			ref={ref}
			type='button'
			aria-label='Dismiss'
			{...dataAttributes}
			{...mergedProps}
			onClick={(e) => {
				dismiss();
				(rest.onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
			}}>
			{children}
		</button>
	);
});

AlertDismiss.displayName = 'Alert.Dismiss';

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Alert = {
	Root: AlertRoot,
	Title: AlertTitle,
	Description: AlertDescription,
	Dismiss: AlertDismiss,
};
