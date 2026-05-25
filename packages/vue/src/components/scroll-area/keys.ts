import { inject, type InjectionKey } from 'vue';
import type { ScrollAreaContextValue, ScrollbarContextValue } from './ScrollArea.types';

export const ScrollAreaKey: InjectionKey<ScrollAreaContextValue> = Symbol('ScrollAreaContext');
export const ScrollbarKey: InjectionKey<ScrollbarContextValue> = Symbol('ScrollbarContext');

export function useScrollAreaContext() {
	const ctx = inject(ScrollAreaKey);
	if (!ctx) throw new Error('ScrollArea sub-components must be used within ScrollArea.Root');
	return ctx;
}

export function useScrollbarContext() {
	const ctx = inject(ScrollbarKey);
	if (!ctx) throw new Error('ScrollArea.Thumb must be used within ScrollArea.Scrollbar');
	return ctx;
}
