import { inject, type InjectionKey } from 'vue';
import type { ToggleGroupContextValue } from './Toggle.types';

export const ToggleGroupKey: InjectionKey<ToggleGroupContextValue> = Symbol('ToggleGroupContext');

export function useToggleGroupContext() {
	return inject(ToggleGroupKey, null);
}
