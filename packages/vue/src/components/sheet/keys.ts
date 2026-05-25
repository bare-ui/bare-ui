import { inject, type InjectionKey } from 'vue';
import type { SheetContextValue } from './Sheet.types';

export const SheetKey: InjectionKey<SheetContextValue> = Symbol('SheetContext');

export function useSheetContext() {
	const ctx = inject(SheetKey);
	if (!ctx) throw new Error('Sheet sub-components must be used within Sheet.Root');
	return ctx;
}
