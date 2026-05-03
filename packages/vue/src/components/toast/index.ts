import ToastProvider from './ToastProvider.vue';
import ToastViewport from './ToastViewport.vue';
import ToastRoot from './ToastRoot.vue';
import ToastTitle from './ToastTitle.vue';
import ToastDescription from './ToastDescription.vue';
import ToastClose from './ToastClose.vue';

export const Toast = {
	Provider: ToastProvider,
	Viewport: ToastViewport,
	Root: ToastRoot,
	Title: ToastTitle,
	Description: ToastDescription,
	Close: ToastClose,
};

export { useToast } from './use-toast';

export type {
	ToastProviderProps,
	ToastViewportProps,
	ToastRootProps,
	ToastTitleProps,
	ToastDescriptionProps,
	ToastCloseProps,
	ToastStatus,
	ToastData,
} from './Toast.types';
