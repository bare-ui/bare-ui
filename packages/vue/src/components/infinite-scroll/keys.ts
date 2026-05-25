import { inject, type InjectionKey } from 'vue';
import type { InfiniteScrollContextValue } from './InfiniteScroll.types';

export const InfiniteScrollKey: InjectionKey<InfiniteScrollContextValue> = Symbol('InfiniteScrollContext');

export function useInfiniteScrollContext() {
	const ctx = inject(InfiniteScrollKey);
	if (!ctx) throw new Error('InfiniteScroll sub-components must be used within InfiniteScroll.Root');
	return ctx;
}
