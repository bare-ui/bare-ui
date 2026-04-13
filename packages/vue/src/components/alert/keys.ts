import { inject, type InjectionKey } from 'vue';
import type { AlertContextValue } from './Alert.types';

export const AlertKey: InjectionKey<AlertContextValue> = Symbol('AlertContext');

export function useAlertContext() {
	const ctx = inject(AlertKey);
	if (!ctx) throw new Error('[wire-ui] Alert sub-components must be used inside <Alert.Root>');
	return ctx;
}
