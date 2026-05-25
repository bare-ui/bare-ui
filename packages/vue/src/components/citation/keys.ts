import { inject, type InjectionKey } from 'vue';
import type { CitationContextValue } from './Citation.types';

export const CitationKey: InjectionKey<CitationContextValue> = Symbol('CitationContext');

export function useCitationContext() {
	const ctx = inject(CitationKey);
	if (!ctx) throw new Error('Citation.Ref/List must be used within Citation.Root');
	return ctx;
}
