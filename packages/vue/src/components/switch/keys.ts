import { inject, type InjectionKey } from 'vue';
import type { SwitchContextValue } from './Switch.types';

export const SwitchKey: InjectionKey<SwitchContextValue> = Symbol('SwitchContext');

export function useSwitchContext() {
	const ctx = inject(SwitchKey);
	if (!ctx) throw new Error('[wire-ui] Switch sub-components must be used inside <Switch.Root>');
	return ctx;
}
