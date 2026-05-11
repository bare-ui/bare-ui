import type { JSX } from 'solid-js';

export type ToastStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** A single toast in the queue. Consumers can extend with arbitrary fields via the generic. */
export interface ToastData<T extends Record<string, unknown> = Record<string, unknown>> {
	id: string;
	title?: JSX.Element;
	description?: JSX.Element;
	status?: ToastStatus;
	/** Auto-dismiss timeout in ms. 0 or negative = persistent. Defaults to 5000. */
	duration?: number;
	/** Pause auto-dismiss while pointer is over the toast. Defaults to true. */
	pauseOnHover?: boolean;
	/** Custom data passed through to the consumer's render-prop. */
	data?: T;
}

export interface ToastProviderProps {
	children?: JSX.Element;
	/** Default duration applied to toasts that don't specify one. */
	defaultDuration?: number;
}

export interface ToastViewportProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Render-prop receiving each toast and a dismiss callback. */
	children: (toast: ToastData, dismiss: () => void) => JSX.Element;
}

export type ToastRootProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ToastTitleProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ToastDescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ToastCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ToastContextValue {
	readonly toasts: ToastData[];
	add: (toast: Omit<ToastData, 'id'> & { id?: string }) => string;
	dismiss: (id: string) => void;
	readonly defaultDuration: number;
}
