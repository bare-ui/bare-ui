import type { Ref } from 'vue'

export type ToastStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** A single toast in the queue. Consumers can extend with arbitrary fields via the generic. */
export interface ToastData<T extends Record<string, unknown> = Record<string, unknown>> {
	id: string;
	title?: string;
	description?: string;
	status?: ToastStatus;
	/** Auto-dismiss timeout in ms. 0 or negative = persistent. Defaults to 5000. */
	duration?: number;
	/** Pause auto-dismiss while pointer is over the toast. Defaults to true. */
	pauseOnHover?: boolean;
	/** Custom data passed through to the consumer's render-prop. */
	data?: T;
}

export interface ToastProviderProps {
	/** Default duration applied to toasts that don't specify one. */
	defaultDuration?: number;
}

export type ToastViewportProps = Record<string, never>;

export type ToastRootProps = Record<string, never>;
export type ToastTitleProps = Record<string, never>;
export type ToastDescriptionProps = Record<string, never>;
export type ToastCloseProps = Record<string, never>;

export interface ToastContextValue {
	toasts: Ref<ToastData[]>;
	add: (toast: Omit<ToastData, 'id'> & { id?: string }) => string;
	dismiss: (id: string) => void;
	defaultDuration: Ref<number>;
}
