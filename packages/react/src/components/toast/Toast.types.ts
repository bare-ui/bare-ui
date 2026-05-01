import React from 'react';

export type ToastStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** A single toast in the queue. Consumers can extend with arbitrary fields via the generic. */
export interface ToastData<T extends Record<string, unknown> = Record<string, unknown>> {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	status?: ToastStatus;
	/** Auto-dismiss timeout in ms. 0 or negative = persistent. Defaults to 5000. */
	duration?: number;
	/** Pause auto-dismiss while pointer is over the toast. Defaults to true. */
	pauseOnHover?: boolean;
	/** Custom data passed through to the consumer's render-prop. */
	data?: T;
}

export interface ToastProviderProps {
	children?: React.ReactNode;
	/** Default duration applied to toasts that don't specify one. */
	defaultDuration?: number;
}

export interface ToastViewportProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Render-prop receiving each toast and a dismiss callback. */
	children: (toast: ToastData, dismiss: () => void) => React.ReactNode;
}

export type ToastRootProps = React.HTMLAttributes<HTMLDivElement>;
export type ToastTitleProps = React.HTMLAttributes<HTMLDivElement>;
export type ToastDescriptionProps = React.HTMLAttributes<HTMLDivElement>;
export type ToastCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ToastContextValue {
	toasts: ToastData[];
	add: (toast: Omit<ToastData, 'id'> & { id?: string }) => string;
	dismiss: (id: string) => void;
	defaultDuration: number;
}
