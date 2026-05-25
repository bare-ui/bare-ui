import { inject, type InjectionKey } from 'vue';
import type { HoverCardContextValue } from './HoverCard.types';

export const HoverCardKey: InjectionKey<HoverCardContextValue> = Symbol('HoverCardContext');

export function useHoverCardContext() {
	const ctx = inject(HoverCardKey);
	if (!ctx) throw new Error('HoverCard sub-components must be used within HoverCard.Root');
	return ctx;
}
