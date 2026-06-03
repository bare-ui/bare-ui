'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useTimeout } from '@/hooks/use-timeout';
import { mergeProps } from '@/utils/merge-props';
import type {
	ToastCloseProps,
	ToastContextValue,
	ToastData,
	ToastDescriptionProps,
	ToastProviderProps,
	ToastRootProps,
	ToastStatus,
	ToastTitleProps,
	ToastViewportProps,
} from './Toast.types';

// ---------------------------------------------------------------------------
// Context + hook
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new globalThis.Error('useToast must be used within Toast.Provider');
	return useMemo(
		() => ({
			toast: ctx.add,
			dismiss: ctx.dismiss,
			toasts: ctx.toasts,
		}),
		[ctx],
	);
}

let toastIdCounter = 0;
function makeId() {
	toastIdCounter += 1;
	return `toast-${Date.now().toString(36)}-${toastIdCounter}`;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const Provider: React.FC<ToastProviderProps> = ({ children, defaultDuration = 5000 }) => {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const add = useCallback(
		(input: Omit<ToastData, 'id'> & { id?: string }) => {
			const id = input.id ?? makeId();
			setToasts((prev) => [...prev.filter((t) => t.id !== id), { ...input, id }]);
			return id;
		},
		[],
	);

	const value = useMemo<ToastContextValue>(
		() => ({ toasts, add, dismiss, defaultDuration }),
		[toasts, add, dismiss, defaultDuration],
	);

	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
Provider.displayName = 'Toast.Provider';

// ---------------------------------------------------------------------------
// Viewport — renders the active toasts via render-prop
// ---------------------------------------------------------------------------

const Viewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(({ children, className, ...rest }, ref) => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new globalThis.Error('Toast.Viewport must be used within Toast.Provider');

	return (
		<div
			ref={ref}
			role='region'
			aria-label='Notifications'
			className={className}
			{...rest}>
			{ctx.toasts.map((t) => {
				const duration = t.duration ?? ctx.defaultDuration;
				return (
					<ToastShell
						key={`${t.id}-${duration}`}
						toast={t}
						duration={duration}
						onDismiss={() => ctx.dismiss(t.id)}>
						{children(t, () => ctx.dismiss(t.id))}
					</ToastShell>
				);
			})}
		</div>
	);
});
Viewport.displayName = 'Toast.Viewport';

// ---------------------------------------------------------------------------
// Internal shell — manages auto-dismiss timer per toast
// ---------------------------------------------------------------------------

interface ToastShellProps {
	toast: ToastData;
	duration: number;
	onDismiss: () => void;
	children: React.ReactNode;
}

const ToastShell: React.FC<ToastShellProps> = ({ toast, duration, onDismiss, children }) => {
	const [delay, setDelay] = useState(duration);
	const [paused, setPaused] = useState(false);
	const startRef = useRef<number>(0);

	useTimeout(onDismiss, delay, { autoStart: !paused && delay > 0 });

	// Set on mount; parent remounts via key when duration/toast.id changes.
	useEffect(() => {
		startRef.current = Date.now();
	}, []);

	const pauseOnHover = toast.pauseOnHover !== false;

	const handleEnter = () => {
		if (!pauseOnHover) return;
		setDelay((d) => Math.max(0, d - (Date.now() - startRef.current)));
		setPaused(true);
	};

	const handleLeave = () => {
		if (!pauseOnHover) return;
		startRef.current = Date.now();
		setPaused(false);
	};

	return (
		<div
			role='status'
			aria-live='polite'
			data-status={toast.status ?? 'default'}
			onPointerEnter={handleEnter}
			onPointerLeave={handleLeave}
			onFocus={handleEnter}
			onBlur={handleLeave}>
			{children}
		</div>
	);
};

// ---------------------------------------------------------------------------
// Optional presentational subcomponents
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ToastRootProps>(({ children, className, ...rest }, ref) => (
	<div
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</div>
));
Root.displayName = 'Toast.Root';

const Title = React.forwardRef<HTMLDivElement, ToastTitleProps>(({ children, className, ...rest }, ref) => (
	<div
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</div>
));
Title.displayName = 'Toast.Title';

const Description = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(({ children, className, ...rest }, ref) => (
	<div
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</div>
));
Description.displayName = 'Toast.Description';

const Close = React.forwardRef<HTMLButtonElement, ToastCloseProps>(({ children, className, onClick, ...rest }, ref) => {
	const { handlers, dataAttributes } = useInteractiveState();
	const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

	return (
		<button
			ref={ref}
			type='button'
			aria-label='Close notification'
			className={className}
			{...dataAttributes}
			{...merged}
			onClick={onClick}>
			{children}
		</button>
	);
});
Close.displayName = 'Toast.Close';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Toast = { Provider, Viewport, Root, Title, Description, Close };
export type { ToastStatus, ToastData };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Toast.*`).
export { Provider, Viewport, Root, Title, Description, Close };
