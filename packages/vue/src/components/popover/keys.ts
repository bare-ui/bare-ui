import { inject, type InjectionKey } from 'vue';
import type { PopoverContextValue } from './Popover.types';

export const PopoverKey: InjectionKey<PopoverContextValue> = Symbol('PopoverContext');

export function usePopoverContext() {
	const ctx = inject(PopoverKey);
	if (!ctx) throw new Error('Popover compound components must be used within Popover.Root');
	return ctx;
}
