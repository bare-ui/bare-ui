import { inject, type InjectionKey } from 'vue';
import type { DiffContextValue } from './Diff.types';

export const DiffKey: InjectionKey<DiffContextValue> = Symbol('DiffContext');

export function useDiffContext() {
	const ctx = inject(DiffKey);
	if (!ctx) throw new Error('Diff sub-components must be used within Diff.Root');
	return ctx;
}
